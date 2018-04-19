const express = require('express');
const router = express.Router();

//@route get api/posts/test
//@desc tests post route
//@access public

router.get('/test', (req,res)=>{
    res.json({msg:"posts Works"})
});

module.exports = router;