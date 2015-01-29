require([
    'components/main',
    'services/yahoo'
], function(
    main,
    yahoo
) {
    yahoo.get(['ARM.L', 'IAG.L', 'AZN.L'], function(err, data){
        console.log(err);
        console.log(data.query);
    });
    
});