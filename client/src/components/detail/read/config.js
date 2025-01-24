instance.UI.addEventListener(instance.UI.Events.DOCUMENT_LOADED, () => {
   
    window.parent.document.getElementById('page_changed').onchange = function(e) {
        instance.Core.documentViewer.setCurrentPage(window.parent.document.getElementById('current-page').innerText);
      };

    
});