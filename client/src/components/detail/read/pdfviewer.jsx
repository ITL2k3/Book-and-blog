import { useEffect, useRef, useState } from 'react';
import WebViewer from '@pdftron/pdfjs-express';

const PDFViewer = ({ buffer }) => {
  const viewerRef = useRef(null);
  useEffect(() => {

    WebViewer(
      {
        path: '/public',
        licenseKey: 'YOUR_KEY_HERE',
      },
      viewerRef.current
    ).then(async (instance) => {
      const { docViewer, annotManager, UI } = instance;

      const blob = new Blob([buffer], { type: 'application/pdf' });
      docViewer.loadDocument(blob, { filename: 'document.pdf' });

      docViewer.on('documentLoaded', async () => {
        try {
          console.log('hello');
          // Fetch annotations từ server ngay sau khi tài liệu được load
          const response = await fetch('http://localhost:3055/v1/api/load-anotation', {
            method: 'get',
            credentials: 'include'
          });
          const messageText = await response.text()
          console.log(messageText);
          const finalRes = JSON.parse(messageText)
          console.log('fetch thanh cong')
          console.log(finalRes)

          // Import annotations vào document viewer
          await annotManager.importAnnotations(finalRes.xml);
          console.log('Annotations imported successfully');
        } catch (error) {
          console.error('Error importing annotations:', error);
        }
      });


      UI.setHeaderItems(header => {
        header.push({
          type: 'actionButton',
          img: 'icon-save',
          onClick: async () => {
          
              const xfdfString = await annotManager.exportAnnotations();
              fetch('http://localhost:3055/v1/api/save-anotation', {
                method: 'post',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ xfdf: xfdfString }),
                credentials: 'include'
              }).then((data) => {
                console.log('ok');
              }).catch((err) => {
                alert('Bạn đã ghi chú quá nhiều, đề nghị xóa bớt ghi chú trước khi lưu')
                console.log('hello');
                console.log('error!!', err);
              })
            
          },
          title: 'Save Document',
        });
      });



      const handleBeforeUnload = event => {
        event.preventDefault();

        return (event.returnValue =
          'Are you sure you want to exit?');
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };

    });
  }, [buffer]);

  return (
    <div>
      <div ref={ viewerRef } style={ { height: '100vh' } }></div>
    </div>
  );
};

export default PDFViewer;
