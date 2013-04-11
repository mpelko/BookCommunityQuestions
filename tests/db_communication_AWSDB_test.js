
current_book_id=0

function test_get_book_id()
{   
    alert(current_book_id)
    var book_title = "Marko Polo"
    update_book_id_AWSDB(book_title)
    console.log("Call issued.")
    function partA() {
       console.log("Waiting ...")
       setTimeout(partB,1000)
    }
    function partB(){
        console.log("... finished waiting.")
        alert(current_book_id)
    }
    partA()
}
