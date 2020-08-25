
exports.GetShipInfo = class GetShipInfo {
  constructor() {
    // jsonオブジェクトを読み込み
    const fs = require('fs');
    this.arrStatus = JSON.parse(fs.readFileSync('./app/contents/Status.json', 'utf8'));
  }

  // jsonオブジェクトを取得
  getJson(shipIds) {
    let index = 0;

    // jsonオブジェクト
    let shipInfos = { 0: {}, 1: {}, 2: {}, 3: {} };

    shipIds.split(',').map(x => {
      // インデックスが範囲内であることを確認
      if (0 < x) {
        // 艦のデータを抽出
        let status = this.arrStatus.filter((y) => { return y["api_id"] == x });
        if (0 < status.length) {
          shipInfos[index] = status[0];
        }
      }
      index++;
    });

    return JSON.stringify(shipInfos);
  }

  // バナーファイル名を取得
  getBannerName(shipIds) {
    let index = 0;
    let altImage = 'no_image.png';
    let fileList = [altImage, altImage, altImage, altImage];

    shipIds.split(',').forEach(x => {

      // インデックスが範囲内であることを確認
      if (0 < x) {
        const fs = require('fs');
        const bannerFolder = './app/public/images/Kanmusu/';

        //shipIdが一致するファイル検索 
        let tempfileList = fs.readdirSync(bannerFolder).filter(function (file) {
          return fs.statSync(bannerFolder + file).isFile() && file.startsWith(('0000' + x).slice(-4))
        });

        // 一番最初に見つかったファイル名をpushする
        if (0 < tempfileList.length) {
          fileList[index] = tempfileList[0];
        }
      };

      index++;
    });

    return fileList;
  }

  // api_id,api_stype,api_nameの連想配列を返す
  getShipList() {
    let shipListArr = this.arrStatus
      .filter(x => x['api_sort_id'] != 0)
      .map(function (x) {
        // api_id, api_Stype,api_nameだけを抽出
        return { api_id: x['api_id'], api_stype: x['api_stype'], api_name: x['api_name'], api_sort_id: x['api_sort_id'] };
      });

    return JSON.stringify(shipListArr.sort((x, y) => x['api_sort_id'] - y['api_sort_id']));
  }


}