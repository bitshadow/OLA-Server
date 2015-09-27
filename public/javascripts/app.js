// App js
(function() {
    var go = 'running!';

    function nano(template, data) {
      return template.replace(/\{([\w\.]*)\}/g, function(str, key) {
        var keys = key.split("."), v = data[keys.shift()];
        for (var i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
      });
    }
    
    function populateDom(data) {
        var container = $('.container');

        var $ul = $('<ul class="nav nav-tabs"></ul>');
        var $content = $('<div class="tab-content"></div>');
        data.ride_estimate.forEach(function(e, i) {
            var bool = i == 0;
            var li = '<li class="' + (bool ? "active" : "") + '"><a data-toggle="tab" id="tab-'+ e.category +'" href="#' + e.category +'"></a></li>';
            $ul.append(li);
            var strActive = bool ? "active in" : "";
            console.log(e);

            var table = nano('<table id="bookingDetailsTable" style="width:100%;"><tbody><tr><td class="descLabel">Car Category:</td><td class="descValue" id="car_category">{e.category}</td></tr><tr><td class="descLabel">Usage:</td><td class="descValue">City Taxi</td></tr><tr><td class="amtLabel">Min Amount:</td><td class="amtValue">{e.amount_min}</td></tr><tr><td class="distLabel">Total Distance:</td><td class="descValue">{e.distance}</td></tr><tr><td class="distLabel">Max Amount (Rs):</td><td class="descValue">{e.amount_max}</td></tr</tbody></table>', { e: e });
            var str = '<div id="'+ e.category +'" class="tab-pane fade '+ strActive +'">'+ table +'</div>';
            $content.append(str);            
        });

        container.append($content);
        $ul.insertBefore('.tab-content');
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
            data: JSON.stringify({
                obj: obj
            }),
            success: function(data) {
                console.log('succes: ' + data);
            }
        });
    }

    function getEstimate() {
        var obj = window.location.search;
        $.ajax({
            url: '/estimate',
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            dataType: 'json',
            data: JSON.stringify({
                obj: obj
            }),
            success: function(data) {
                populateDom(data);
                // console.log('estimate succes: ', data);
            }
        });
    }

    window.onload = function() {
        var $bookButton = $('.ola-btn');
        $bookButton.on('click', bookOla);

        getEstimate();
    }
})();
    