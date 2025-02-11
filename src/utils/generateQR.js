import QRCode from 'qrcode';

const generateQR = async (url) => {
    try {
        const qrDataUrl = await QRCode.toDataURL(url);
        return qrDataUrl;
    } catch (err) {
        console.error(err);
        return null;
    }
};

export default generateQR; 