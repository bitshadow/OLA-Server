// App js
(function() {
    var go = 'running!';

    // this function return the src and destination from the url
    // in the following format:
    // {
    // src : [X, Y]
    // dest : [X, Y]
    //}
    function getEndpoints(url) {
        return {
            src: getCoordinates(url, 0, 2),
            dst: getCoordinates(url, 2, 4)
        };
    }

    // this function reurn the source
    // [X, y]
    function getCoordinates(data, start, end) {

        return processCoOrdinate(data.match(regex).slice(start, end));
    }

    // util function to process the co-ordinate
    // remove the unwanted char
    function processCoOrdinate(points) {
        var output = [];
        for (element in points) {
            point = points[element];
            point = point.replace("1d", "");
            point = point.replace("2d", "");
            point = point.replace("!", "");
            output.push(point);
        }
        return output;
    }

    function bookOla() {
        var obj = window.location.search;
        console.log('iframe obj: ', obj);
        $.ajax({
            url: '/book',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({ obj: obj }),
            success: function(data) {
                console.log('succes: ' + data);
            }
        });
    }

    window.onload = function() {
        var $bookButton = $('.ola-btn');
        $bookButton.on('click', bookOla);
    }
})();
