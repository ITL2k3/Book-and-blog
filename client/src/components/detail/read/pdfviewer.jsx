import { useEffect, useRef } from 'react';
import WebViewer from '@pdftron/pdfjs-express';
const content = document.getElementsByClassName('content')
//class: content: document
const PDFViewer = ({ buffer, bookId }) => {
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
      docViewer.loadDocument(blob, { filename: 'document.pdf'});

      docViewer.on('documentLoaded', async () => {
        try {
          // Fetch annotations từ server ngay sau khi tài liệu được load
          const response = await fetch(`http://localhost:3055/v1/api/load-anotation?bookId=${bookId}`, {
            method: 'get',
            credentials: 'include'
          });
          const messageText = await response.text()
          const finalRes = JSON.parse(messageText)

          // Import annotations vào document viewer
          await annotManager.importAnnotations(finalRes.metadata.xml_data);
          console.log('Annotations imported successfully');
        } catch (error) {
          console.error('Error importing annotations:', error);
        }
      });

  
      UI.disableElements(['toggleNotesButton', 'printButton', 'copy', 'copyTextButton'])
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
                body: JSON.stringify({ xml: xfdfString, bookId: bookId }),
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

      UI.hotkeys.off()
      // UI.hotkeys.on('ctrl+c', {
      //   keydown: e => {
      //     e.preventDefault()
      //     console.log('ctrl+c is pressed!');
      //   },
      //   keyup: e => {
      //     console.log('ctrl+g is released!')
      //   },
      // });

      

    });

    
  }, [buffer]);
//   useEffect(() => {
//     const handleKeyDown = (event) => {
//       console.log('helloads');
//       event.preventDefault(); // Ngăn chặn hành động mặc định
//     };
//     document.addEventListener('keydown', handleKeyDown);

//     // return () => {
//     //     document.removeEventListener('copy', handleCopy);
//     // };
// }, []);
// content.addEventListener('keydown', function(event) {
//   console.log('hellosd');
//   if (event.ctrlKey && event.key === 'c') {
//       event.preventDefault();
//   }
// });
 

  return (
    <div>
      <div ref={ viewerRef } style={ { height: '100vh' } }></div>
    </div>
  );
};

export default PDFViewer;
