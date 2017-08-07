let datbase = require('./datbase');

module.exports = function main(inputs) {
    let arrayTags = createTagsInfo(inputs);
    let promotionTags = createPromotionTags(arrayTags);
    let priceOfTags = calculateTagsPrices(promotionTags);
    let summary = calculateSummary(priceOfTags);
    let discount = calculateDiscount(priceOfTags);

    return printAllTags(priceOfTags,summary,discount);
}
function printAllTags(priceOfTags,summary,discount) {
    console.log('***<没钱赚商店>购物清单***\n');
    for(let item of priceOfTags){
        console.log('名称：' + item.name + '，数量：' + item.count + item.unit + '，单价：' + item.price.toFixed(2) + '(元)，小计：' + item.totalprice.toFixed(2) + '(元)\n');
    }
    console.log('----------------------\n');
    console.log('挥泪赠送商品：\n' );
    for(let item of priceOfTags){
        if(item.promotion) {
            console.log('名称：' + item.name + '，数量：' + item.count + item.unit + '\n');
        }
    }
    console.log('----------------------\n');
    console.log('总计：' + summary.toFixed(2) + '(元)\n')

}


function calculateSummary(priceOfTags) {
    let sum = 0;
    for(let item of priceOfTags){
        sum += item.totalprice;
    }
    return sum;
}
function calculateDiscount(priceOfTags) {
    let discount = 0;
    for(let item of priceOfTags){
        discount += item.promotion*item.price;
    }
    return discount;
}


function calculateTagsPrices(promotionTags) {
    let priceOfTags = addTagsCharacter(promotionTags);
    calculatePrice(priceOfTags);
    return priceOfTags;
}
function calculatePrice(priceOfTags) {
    for(let item of priceOfTags){
        item.totalprice = (item.count-item.promotion)*item.price;
    }
    return priceOfTags;
}


function addTagsCharacter(promotionTags) {
    let items = [];
    let itemsAll = datbase.loadAllItems();
    for(let item of promotionTags){
         let obj = addCharacter(itemsAll,item);
         if(obj){
             items.push(obj);
        }
    }
    return items;
}
function addCharacter(itemsAll,obj) {
    for(let item of itemsAll){
        if(item.barcode === obj.barcode){
            obj.name = item.name;
            obj.unit = item.unit;
            obj.price = item.price;
            return obj;
        }
    }
    return null;
}


function createPromotionTags(arrayTags){
    let promotions = datbase.loadPromotions();
    for(let item of arrayTags){
        let judge = findPromotions(promotions,item);
        if(judge){
            item.promotion = parseInt(item.count/3);
        }else{
            item.promotion = 0;
        }
    }
    return arrayTags;
}
function findPromotions(promotions,obj) {
    for(let item of promotions){
        for(let item2 of item.barcodes){
            if(item2 === obj.barcode){
                return true;
            }
        }
    }
    return false;
}


function createTagsInfo(Tags){
    let array = expendsTags(Tags);
    // console.log(array);
    return summarizeTags(array);
}
function summarizeTags(array){
    let result = [];
    for(let item of array){
        let obj = finds(result,item);
        if(obj){
            obj.count++;
        }else{
            result.push({barcode: item, count: 1});
        }
    }
    console.log(result);
    return result;
}
function finds(result,ch){
    for(let item of result){
        if(item.barcode === ch){
            return item;
        }
    }
    return null;
}

function expendsTags(Tags){
    let result = [];
    for(let item of Tags){
        if(item.length > 10){
            let {barcode,count} = split(item);
            push(result,barcode,count);
        }else{
            result.push(item);
        }
    }
    return result;
}
function split(ch){
    let array = ch.split("-");
    return {barcode:array[0], count:parseInt(array[1],10)};
}
function push(result,barcode,count){
    for(var i=0; i<count; i++){
        result.push(barcode);
    }
}