const fs = require('fs')
const path = require('path')
const child_process = require('child_process')
const fsEx = require('fs-extra')
/**
 * @des 该包为实验性API
 */
const fsPromises = require('fs').promises



const sourcePath = "/Users/mario/Desktop/source";
const targetPath = "/Users/mario/Desktop/target";


let start = function () {
    fs.readdirSync(sourcePath).forEach((element , index, array)=>{
        console.log("文件111:" + element);
        var sourceFile = path.join(sourcePath, element);
        var targetFile = path.join(targetPath, element);
        if (element.indexOf(".plot") > -1) {
            console.log("文件:" + element);
            copyFile(sourceFile, targetFile);
            deleteFile(sourceFile);
        }
        if (index == array.length - 1) {
            console.log("完成遍历,等待10秒");
            setTimeout(() => {
                start();
            }, 10000);
        }
    })
};

start();

/**
 * @param { copiedPath: String } (被复制文件的地址，相对地址)
 * @param { resultPath: String } (放置复制文件的地址，相对地址)
 */
function copyFile(copiedPath, resultPath) {
    try {
        fs.copyFileSync(copiedPath, resultPath)
        console.log('Success Copy');
    } catch (error) {
        console.log(error);
    }
}


/**
 * @param { delPath：String } （需要删除文件的地址）
 */
function deleteFile(delPath) {
    try {
        /**
         * @des 判断文件或文件夹是否存在
         */
        if (fs.existsSync(delPath)) {
            fs.unlinkSync(delPath);
            console.log('Success Delete');
        } else {
            console.log('Inexistence path：', delPath);
        }
    } catch (error) {
        console.log('del error', error);
    }
}