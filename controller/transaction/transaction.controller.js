let Transaction =require('../../model/transactions/transaction');
const {transactionData,transactionUpdateData} = require("../../model/transactions/validation");

exports.index=async (req,res)=> {
    let transaction= await Transaction.find({ '_id': { $in:req.user.transactions}}, function(err){
        if (err) return res.status(400).json(err);
    });
    return res.json({transaction,status:true})
};

exports.createOne=async (req,res)=> {
    let {error,value}=await transactionData(req.body);
    if (error) return res.json({error:error.details.map((err)=>err.message)});
    value.userID=req.user._id;
    let transaction=await new Transaction(value);
    Transaction.data=req.body;
    transaction=await transaction.save();
    req.user.transactions.push(transaction._id);
    // req.user.transactions.push(transaction);
    await req.user.save();
    return res.json({status:true,transaction})
};

exports.showOne=async (req,res)=> {
    let transaction=await Transaction.findById(req.params.id,(err,transaction)=>{
        if (err) return res.status(404).json(err);
        // return res.json({status:true,transaction});
    });
    return res.json({status:true,transaction})
};

//Transaction
exports.updateOne=async (req,res)=> {
    let {error,value}=await transactionUpdateData(req.body);
    if (error) return res.json({error:error.details[0].message,validation:true});
    value.updatedAt=Date.now();
    let transaction=await Transaction.findByIdAndUpdate(req.params.id,value,(err,transaction)=>{
        if (err) return res.status(400).json(err);

        // return res.json({status:true,transaction});
    });
    if (req.body.length) {
        transaction.data.push(req.body);
        await transaction.save();
    }

    return res.json({status:true,transaction});
};

exports.deleteOne=async (req,res)=> {
    let transaction=await Transaction.findByIdAndRemove({_id:req.params.id},req.body,(err,transaction)=>{
        if (err) return res.status(400).json(err);
        // return res.json({status:true,transaction});
    });
    return res.json({status:true,transaction});
};
