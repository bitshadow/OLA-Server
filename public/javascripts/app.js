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
      var regex = /![1|2]d[+,-]*[0-9]+.[0-9]+/g;
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

    // set the request to local server to
    // collect the estimate.
    // pickup_lat=12.950072&pickup_lng=77.642684&ca  tegory=sedan&drop_lat=12.994847&drop_lng=77.666201
    function getEstimate() {
      console.log(window.location.search);
      $.get(
        '/estimate' + window.location.search,
        function(data, status){
        alert("Data: " + data + "\nStatus: " + status);
    });
    }

    console.log('req sent');

    window.onload = function() {
        var $bookButton = $('.ola-btn');
        $bookButton.on('click', bookOla);

        getEstimate();
    }
})();
