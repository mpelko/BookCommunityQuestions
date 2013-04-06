function test_get(){    
    alert(get_all_QA(0)[0].location)
    alert([])
    var subset = get_QA_subset(0, 50,200)
    alert(subset)
    var subset = get_QA_subset(0, 50,70)
    alert(subset)
}