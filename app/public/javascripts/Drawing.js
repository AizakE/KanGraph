$(function () {
  // イベントリスナー
  // グラフ表示ボタンクリック
  $('#btnGraphView').click(function () {
    let param1 = $('input:radio[name="lineColor1"]:checked').val();
    let param2 = $('input:radio[name="lineColor2"]:checked').val();
    let param3 = $('input:radio[name="lineColor3"]:checked').val();
    let param4 = $('input:radio[name="lineColor4"]:checked').val();

    let params = [
      isNaN(param1) ? 0 : param1,
      isNaN(param2) ? 0 : param2,
      isNaN(param3) ? 0 : param3,
      isNaN(param4) ? 0 : param4,
    ]
    // location.href = '/' + $('input:radio[name="lineColor1"]:checked').val();
    location.href = '/result?params=' + params;
  });
});


window.onload = function () {

  if ($('#shipBanner').val() != '') {
    this.showBanner();
  }

  if ($('#shipStatus').val() != '') {
    this.Draw();
  }

  if ($('#shipList').val() != '') {
    this.showSelction();
  }

  if ($('#shipStatus').val() != '') {
    this.showTable();
  }

}


// グラフ描画
function Draw() {

  let statMinIdx = 0;
  let statMaxIdx = 1;
  let lineSize = 1;
  let lineColorList = ['cc0000', '00cc00', '0000cc', '333333'];
  let xFields = ['0', '20', '40', '60', '80', '100']
  // const yFields = ['耐久','火力','雷装','対空','対潜','索敵','運','回避','装甲']
  let yFields = ['耐久', '火力', '対空', '雷装', '運', '装甲']
  let maxValue = 100;
  let minValue = 0;
  let statusTexts = [];
  // 100越えのステータスがある場合のフラグ
  let overHundredFlg = false;

  // jsonデータ
  let shipStatusList = JSON.parse($('#shipStatus').val());

  Object.keys(shipStatusList).forEach(key => {
    if (0 < Object.keys(shipStatusList[key]).length) {
      // 改修後の最大値を取得 耐久と運は改修前
      let status = {
        taikyu: shipStatusList[key]['api_taik'][statMinIdx],
        karyoku: shipStatusList[key]['api_houg'][statMaxIdx],
        taiku: shipStatusList[key]['api_tyku'][statMaxIdx],
        raisou: shipStatusList[key]['api_raig'][statMaxIdx],
        un: shipStatusList[key]['api_luck'][statMinIdx],
        soukou: shipStatusList[key]['api_souk'][statMaxIdx]
      };

      statusTexts.push(Object.values(status).join(',') + ',' + status.taikyu);

      // 100越えのステータス有無を確認
      Object.keys(status).forEach(x => {
        if (100 < status[x]) {
          overHundredFlg = true;
        }
      })
    }
  });

  // 100越えのステータスがある場合はx軸を拡張
  if (overHundredFlg) {
    xFields = ['0', '20', '40', '60', '80', '100', '120', '140'];
    maxValue = 140;
  }

  // X軸表示文字
  let xFieldsText = '|' + xFields.join('|');
  // Y軸表示文字
  let yFieldsText = '|' + yFields.join('|');
  // グラフ数値
  let chd = statusTexts.join('|');
  // 数値線の太さ
  let chls = lineSize;
  // 線の色
  let chco = lineColorList[0];

  // 艦の数だけ追記が必要なパラメータを追記
  for (let i = 1; i < statusTexts.length; i++) {
    chls = chls + '|' + lineSize;
    chco = chco + ',' + lineColorList[i];
  }

  // ChartsAPIのタグ記述
  let imgTagText = `<img src="http://chart.apis.google.com/chart?cht=r&chxt=x,y&chds=${minValue},${maxValue}
&chxl=0:${yFieldsText}|1:${xFieldsText}
&chco=${chco}
&chd=t:${chd}
&chls=${chls}
&chf=c,t,000000|bg,t
&chs=350x350" alt="card" />
`;
  //&chm=B,00FF0020,0,0,0


  // グラフを表示
  $('#graphArea').append($(imgTagText));
  // 艦名を表示
  $('#ship1Name').append(shipStatusList[0]['api_name']);
  $('#ship2Name').append(shipStatusList[1]['api_name']);
  $('#ship3Name').append(shipStatusList[2]['api_name']);
  $('#ship4Name').append(shipStatusList[3]['api_name']);

  // グラフを可視化
  $('#shipCard').css('display', '');
}

// バナー表示
function showBanner() {
  let bannerList = $('#shipBanner').val().split(',');

  $('#ship1Img').attr('src', "/images/Kanmusu/" + bannerList[0]);
  $('#ship2Img').attr('src', "/images/Kanmusu/" + bannerList[1]);
  $('#ship3Img').attr('src', "/images/Kanmusu/" + bannerList[2]);
  $('#ship4Img').attr('src', "/images/Kanmusu/" + bannerList[3]);
}

// テーブル表示
function showTable() {
  // 表示項目
  let fieldNames = [['耐久', 'api_taik'], ['火力', 'api_houg'], ['対空', 'api_tyku'], ['雷装', 'api_raig'], ['運', 'api_luck'], ['装甲', 'api_souk']]
  // jsonデータ
  let shipStatusList = JSON.parse($('#shipStatus').val());
  // 表示するタグを生成
  Object.keys(shipStatusList).forEach(x => {
    // api_nameを取得できれば値があるものと判定
    if (shipStatusList[x]['api_name'] != void 0) {
      // 艦名とステータスを表示
      let rowText = '';

      // 艦名とステータスを表示
      rowText = `<td>${shipStatusList[x]['api_name']}</td>`;
      fieldNames.forEach(row => {
        let min = shipStatusList[x][row[1]][0];
        let max = shipStatusList[x][row[1]][1];
        let tdText = `<td>${min}/${max}</td>`;
        rowText += (tdText);
      });

      // 一行に表示するtdタグをtrタグではさむ
      rowText = `<tr>${rowText}</tr>`;
      // タグを出力
      $('#statusTbody').append($(rowText));
    }
  });

}

// 選択肢を表示
function showSelction() {
  let shipType = {
    kaibou: 1,
    kuchiku: 2,
    keijun: 3,
    raijun: 4,
    juujun: 5,
    koujun: 6,
    keiKuubo: 7,
    kouSenkan: 8,
    teiSenkan: 9,
    kousen: 10,
    seikiKuubo: 11,
    sensui: 13,
    senkuu: 14,
    suibo: 16,
    youriku: 17,
    soukuu: 18,
    kousaku: 19,
    senbo: 20,
    renjun: 21,
    hokyuu: 22
  };

  // jsonデータ
  let shipList = JSON.parse($('#shipList').val());

  // listを表示
  shipList.map(x => {
    tagText = `
      <li class= "shipLabel uk-background-muted uk-text-small">
      <label class='uk-margin-right'>1：<input type="radio" class="uk-radio " name="lineColor1" value="${x['api_id']}"></label>
      <label class='uk-margin-right'>2：<input type="radio" class="uk-radio " name="lineColor2" value="${x['api_id']}"></label>
      <label class='uk-margin-right'>3：<input type="radio" class="uk-radio " name="lineColor3" value="${x['api_id']}"></label>
      <label class='uk-margin-right'>4：<input type="radio" class="uk-radio " name="lineColor4" value="${x['api_id']}"></label>
      ${x['api_name']}
      </li>
    `;

    // 艦種によって、表示位置を振り分け
    switch (x['api_stype']) {
      case shipType.kouSenkan:
      case shipType.teiSenkan:
      case shipType.kousen:
        $('#senkanClass').append($(tagText));
        break;

      case shipType.seikiKuubo:
      case shipType.soukuu:
      case shipType.keiKuubo:
        $('#kuuboClass').append($(tagText));
        break;

      case shipType.juujun:
      case shipType.koujun:
        $('#juujunClass').append($(tagText));
        break;

      case shipType.keijun:
      case shipType.raijun:
      case shipType.renjun:
        $('#keijunClass').append($(tagText));
        break;

      case shipType.kuchiku:
        $('#kuchikuClass').append($(tagText));
        break;

      case shipType.sensui:
      case shipType.senkuu:
        $('#sensuiClass').append($(tagText));
        break;

      case shipType.kaibou:
        $('#kaibouClass').append($(tagText));
        break;

      default:
        $('#otherClass').append($(tagText));
        break;

    }
  });

}