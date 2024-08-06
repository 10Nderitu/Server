import router from "express"

router.post("/",(req,res)=>{
    console.log(req.body)
})

router.get("/",(req,res)=>{
    res.status(200).json({user : {
        name: "ray",
        age: "20"
    }})
})

module.exports = router