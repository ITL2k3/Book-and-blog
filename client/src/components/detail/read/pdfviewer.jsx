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
      const { docViewer, documentViewer, annotManager, UI, Core } = instance;
    
      const blob = new Blob([buffer], { type: 'application/pdf' });
      docViewer.loadDocument(blob, { filename: 'document.pdf' });



      
      

   



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

      UI.disableElements(['toggleNotesButton', 
        'notesPanelButton','notesPanel','printButton', 
        'downloadButton','printButton','fileAttachmentDownload',
        'linkButton','annotationCommentButton','copy', 'copyTextButton',
      'annotationNoteConnectorLine','filePickerButton',
      'annotationCommentButton','polygonToolButton','imageSignaturePanelButton',
      'fileAttachmentToolGroupButton','notesToolButton', 'commentToolButton'
    ,'stickyToolGroupButton','stickyToolButton'])
      
        // Core.documentViewer.addEventListener('documentLoaded', () => {

        //   const checkForNewBookmarks = async () => {
        //     const bookmarks = await Core.documentViewer.getDocument().getBookmarks();
        //     Core.documentViewer.displayBookmark(bookmarks[5])
            
        //     console.log(bookmarks);
        //   }
        //   setInterval(checkForNewBookmarks, 2000);
          
        // })




     
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
              alert('Lưu thành công!')
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
      UI.addEventListener('keydown', (e) => {
       
        if(e.key == 'F12' || e.key == "Control" || e.key == 'Shift' || e.key == 'Alt'){
          console.log('blocked!');
          e.preventDefault();
        }
      
        
      })
      
      UI.hotkeys.off()
      // // UI.hotkeys.off()
      // UI.hotkeys



    });




  }, [buffer]);

  

  return (
    <div>
      <div ref={ viewerRef } style={ { height: '100vh' } }></div>
    </div>
  );
};

export default PDFViewer;
