import pdfjsLib from 'vue3-pdfjs'
export class AppUtils {
    static FormatarDataHora(date) {
        const options = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
        }
        return (date ?
            new Date(date).toLocaleDateString('pt-BR', options) :
            new Date().toLocaleDateString('pt-BR', options)).replace(', ', ' ');
    }

    static formatarCPF(documento) {
        return documento.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }

    static formatarCNPJ(documento) {
        return documento.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    }

    static converterBase64ParaPDF(documentoBase64, returnFunction) {
           
        const buffer = Uint8Array.from(atob(documentoBase64), (c) => c.charCodeAt(0));
       
        pdfjsLib.getDocument({ data: buffer }).promise.then((pdfDocument) => {               
            pdfDocument.getPage(1).then((pdfPage) => {                 
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                const viewport = pdfPage.getViewport({ scale: 1.0 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;
    
                pdfPage.render({ canvasContext: context, viewport }).promise.then(() => {                     
                    const imageData = canvas.toDataURL('image/png');
                    returnFunction(imageData);
                });
            });
        });
    }
}
