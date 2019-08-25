const nodemailer = require('nodemailer');

let transport = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
       user: 'a73af053fdde46',
       pass: 'de2e9f487453da'
    }
});




function getEmailTemplate(ine, frame, mapPic) {
  let creditStatus = `<center>
    <table width="600" style="font-family: Helvetica, sans-serif; font-size: 14px; ">
      <thead style="vertical-align: middle;">
        <tr style="font-size: 10px;" align="center">
          <th style="padding-top: 30px">Reporte No. 23-678293</th>
          <th>
            <img src="http://violeta.space/credibot/logo-credibot.png" width="250" height="100" alt="">
          </th>
          <th style="padding-top: 30px">Agosto 25, 2019</th>
        </tr>
      </thead>

      <tbody>
        <!-- Datos personales -->
        <tr>
          <td colspan="3" style="padding: 30px 0; border-bottom: 1px dashed #333;">
            <strong>Cliente:</strong> Bernardo León Perez Hernandez <br>
            <strong>Dirección:</strong> Eje 8 sur av, popocatepetl núm. 0265 yac dpto 12 f1403 <br>
            santa cryz atoyac <br>
            c.p: 03310 <br>
            benito juárez, cd. de mex. <br>
            méxico.
          </td>
        </tr>
        <!-- / Datos personales -->

        <!-- Facial -->
        <tr>
          <td colspan="3" style="font-weight: bold; font-size: 16px; padding: 30px 0 20px 0;">ÍNDICE DE CONFIABILIDAD PARA IDENTIDAD I RECONOCIMIENTO FACIAL </td>
        </tr>
        <tr>
          <td style="padding-bottom: 30px"><img src="${ine}" alt=""> </td>
          <td style="padding-bottom: 30px"><img src="https://quickchart.io/chart?c={type:%27radialGauge%27,data:{datasets:[{data:[83],backgroundColor:%27limegreen%27}]}}" width="250" height="150" alt=""></td>
          <td style="padding-bottom: 30px"><img src="${frame}" alt=""> </td>
        </tr>
        <!-- / Facial -->

        <!-- Domicilio -->
        <tr>
          <td colspan="3" style="font-weight: bold; font-size: 16px; padding: 30px 0; border-top: 1px dashed #333;">ÍNDICE DE EXACTITUD DE LA UBICACIÓN DEL DOMICILIO </td>
        </tr>
        <tr>
          <td style="padding-bottom: 30px"><img src="http://violeta.space/credibot/address-01.png" alt=""> </td>
          <td style="padding-bottom: 30px"><img src="https://quickchart.io/chart?c={type:%27radialGauge%27,data:{datasets:[{data:[5],backgroundColor:%27red%27}]}}" width="250" height="150" alt=""> </td>
          <td style="padding-bottom: 30px"><img src="${mapPic}" alt=""> </td>
        </tr>
        <!-- / Domicilio -->

        <!-- Resumen -->
        <tr>
          <td colspan="3" style="font-weight: bold; font-size: 16px; padding: 30px 0; border-top: 1px dashed #333;">RESULTADO</td>
        </tr>
        <tr>
          <td colspan="2" style="padding-bottom: 20px;"><img src="https://quickchart.io/chart?c={type:'horizontalBar',data:{labels:['VERIFICACIÓN DE IDENTIDAD','VERIFICACIÓN DE DOMICILIO','CONFIABILIDAD'], datasets:[{data:[90,5,45,0],label:'%25',backgroundColor:%27red%27}]}}" width="400" height="240" alt=""> </td>
          <td align="center" style="padding-bottom: 20px;">
            <img src="http://violeta.space/credibot/icon-nope.png" alt=""> <br>
            <a style="padding: 10px; border: 1px solid black; border-radius: 100px; color: black; text-decoration: none; display: inline-block; margin: 10px;" href="#">Revisar status</a>
          </td>
        </tr>
        <!-- / Resumen -->
      </tbody>

      <tfoot>
        <tr>
          <td colspan="3" align="center" style="padding: 20px 0; border-top: 1px dashed black;">Hecho con ❤ por Las Mentes de Dr. Malito</td>
        </tr>
      </tfoot>
    </table>
  </center>`;

  return creditStatus;

}

module.exports = function send (conf) {
  let msg = {
    ...conf,
    html: getEmailTemplate(conf.ine, conf.frame, conf.mapPic)
  }

  transport.sendMail(msg, function(err, info) {
    if (err) {
      console.log(err)
    } else {
      console.log(info);
    }
});
}
