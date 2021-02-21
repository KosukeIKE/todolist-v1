/* 
//必ずかっこはつけてはいけない,一つだけをインポートするときにはこれが一般的である。

module.exports = GetDate;

function GetDate() {

    const options = {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    };

    let today = new Date();
    return today.toLocaleDateString('en-US', options);
}; */