var express = require('express');
const User = require('./schemas/users');
const { errorHandle, successHandle } = require('./dbserver/responseHandler');
var router = express.Router();

router.get('/user', async (req, res) => {
    const result = await User.find({});
    successHandle(res, "取得所有 User 成功", result);
})

router.post('/finduser', async (req, res) => {
    try {
        const content = req.body;
        if (content.帳號 !== "") {
            const result = await User.find({ 帳號: content.帳號 });
            successHandle(res, "新增帳戶成功", result);
        } else {
            errorHandle(res, 400, 40002);
        }

    } catch (error) {
        errorHandle(res, 400, 40001);
    }
})

router.post('/useradd', async (req, res) => {
    try {
        const content = req.body;
        if (content.帳號 !== "" && content.密碼 !== "" && content.名稱 !== "") {
            const result = await User.create(content);
            successHandle(res, "新增帳戶成功", result);
        } else {
            errorHandle(res, 400, 40002);
        }

    } catch (error) {
        errorHandle(res, 400, 40001);
    }
})

router.post('/userpwdedit', async (req, res) => {
    try {
        const content = req.body;
        if (content.密碼 !== "") {
            const result = await User.updateOne({ 帳號: content.帳號 }, { $set: { 密碼: content.密碼 } });
            successHandle(res, "修改密碼成功", result);
        } else {
            errorHandle(res, 400, 40002);
        }
    } catch (error) {
        errorHandle(res, 400, 40001);
    }
})

router.post('/achievementadd', async (req, res) => {
    try {
        const content = req.body;
        if (content.成就 !== "") {
            const result = await User.updateOne({ 帳號: content.帳號 }, { $set: { 成就: content.成就 } });
            successHandle(res, "新增成就成功", result);
        } else {
            errorHandle(res, 400, 40002);
        }
    } catch (error) {
        errorHandle(res, 400, 40001);
    }
})

router.post('/count', async (req, res) => {
    try {
        const content = req.body;

        if (parseInt(content.次數) === 1) {
            let num = 0;
            const account = await User.findOne({ 帳號: content.帳號 });

            if (!account) {
                return errorHandle(res, 404, 40003);
            }

            if (account.次數 === undefined) {
                await User.updateOne(
                    { 帳號: content.帳號 },
                    { $set: { 次數: 1 } }
                );
            } else {
                num = num + account.次數;
                await User.updateOne(
                    { 帳號: content.帳號 },
                    { $set: { 次數: num + 1 } }
                );
            }

            successHandle(res, "新增次數成功");
        } else {
            errorHandle(res, 400, 40002);
        }
    } catch (error) {
        errorHandle(res, 400, 40001);
    }
});



router.post('/endcollect', async (req, res) => {
    try {
        const content = req.body;
        if (content.結局收集 !== "") {
            const existingUser = await User.findOne({
                帳號: content.帳號,
                結局收集: content.結局收集
            });

            if (existingUser) {
                errorHandle(res, 400, 40002);
                console.log('此結局已解鎖');
            } else {
                const result = await User.findOneAndUpdate(
                    { 帳號: content.帳號 },
                    { $push: { 結局收集: content.結局收集 } },
                    { new: true }
                );
                successHandle(res, "新增成就成功", result);
            }
        } else {
            errorHandle(res, 400, 40002);
        }
    } catch (error) {
        errorHandle(res, 400, 40001);
    }
});

// router.get('/students/new', function(req, res) {
//     res.render('new.html');
// })
// router.post('/students/new', function(req, res) {
//     var student = req.body;
//     Student.save(student, function(err) {
//         if(err) {
//             return res.status(500).send('Server Error!');
//         }
//         res.redirect('/students');
//     })
// })
// router.get('/students/edit', function(req, res) {
//     //根據id把該學生找出來，並渲染頁面
//     var id = req.query.id; //=> string，要轉成Number
//     Student.findById(parseInt(id), function(err, student) {
//         if(err) {
//             return res.status(500).send('Server Error!');
//         }
//         res.render('edit.html', {
//             student:student
//         });
//     })
// })
// router.post('/students/edit', function(req, res) {
//     //1.獲取表單數據
//     //2.更新: Student.updateById()
//     //3.發送響應
//     Student.updateById(req.body, function(err, student) {
//         if(err) {
//             return res.status(500).send('Server Error!');
//         }
//         res.redirect('/students')
//     })
// })
// router.get('/students/delete', function(req, res) {
//     //1.獲取要刪除的id
//     //2.根據id執行刪除
//     //3.發送響應
//     Student.delete(req.query.id, function(err) {
//         if(err) {
//             return res.status(500).send('Server Error!');
//         }
//         res.redirect('/students');
//     })
// })

//把 router 導出
module.exports = router;