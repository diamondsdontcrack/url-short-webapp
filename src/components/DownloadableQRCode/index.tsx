import React from "react";
import QRCode from "react-qr-code";
import { Button } from "semantic-ui-react";

export interface DownloadableQRCodeProps {
  value: string;
}

const DownloadableQRCode: React.VFC<DownloadableQRCodeProps> = ({ value }) => {
  const handleDownloadQrCode = (mime: string) => {
    const qrRef = document.getElementsByTagName("svg")[0];
    const svgData = new XMLSerializer().serializeToString(qrRef);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = function () {
      if (ctx !== null) {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const pngFile = canvas.toDataURL(mime);

        const downloadLink = document.createElement("a");
        downloadLink.download = "qrcode";
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  return (
    <>
      <QRCode value={value} />

      <div style={{ padding: "10px" }}>
        <Button
          color="blue"
          icon="download"
          labelPosition="right"
          content="Download JPG"
          onClick={() => handleDownloadQrCode("image/jpeg")}
        />
        <Button
          color="blue"
          icon="download"
          labelPosition="right"
          content="Download PNG"
          onClick={() => handleDownloadQrCode("image/png")}
        />
      </div>
    </>
  );
};

export default DownloadableQRCode;
