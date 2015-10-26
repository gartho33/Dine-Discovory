$("#testBtn").on('click', function(){
   TestSearch(); 
});

function outputUpdate(miles) {
   document.querySelector('#miles').value = "Within " + miles + " Miles";
}