$(document).ready(function() {
    var url = ''; // The URL will be set after file upload
    var pdfDoc = null;
    var pageNum = 1;
    var scale = 1; // Default scale
    var canvas = document.getElementById('pdf-canvas');
    var ctx = canvas.getContext('2d');

    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.continuous = true;
    recognition.interimResults = true;
    var isRecognizing = false;
    var startStopBtn = document.getElementById('start-stop-btn'); // Optional for manual control
    var transcriptionDiv = document.getElementById('transcription');

    function startRecognition() {
        recognition.lang = 'en-US';
        recognition.start();
        isRecognizing = true;
    }

    function stopRecognition() {
        recognition.stop();
        isRecognizing = false;
    }

    recognition.onstart = function() {
        console.log('Speech recognition started...');
    };

    recognition.onresult = function(event) {
        var transcript = '';
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            transcript += event.results[i][0].transcript;
        }
        transcriptionDiv.textContent = transcript;
    };

    recognition.onerror = function(event) {
        console.error('Speech recognition error', event.error);
    };

    recognition.onend = function() {
        console.log('Speech recognition ended.');
        // Optionally restart recognition
        if (isRecognizing) {
            startRecognition();
        }
    };

    // Start recognition automatically
    startRecognition();


    function renderPage(num, scale) {
        pdfDoc.getPage(num).then(function(page) {
            var viewport = page.getViewport({scale: scale});
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            var renderContext = {
                canvasContext: ctx,
                viewport: viewport
            };

            document.getElementById('page-num').textContent = num + ' / ' + pdfDoc.numPages;

            page.render(renderContext);
        });
    }

    function renderThumbnails() {
        $('#sidebar').empty();
        for (let i = 1; i <= pdfDoc.numPages; i++) {
            pdfDoc.getPage(i).then(function(page) {
                var viewport = page.getViewport({scale: 0.2});
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                var renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };

                page.render(renderContext).promise.then(() => {
                    $('#sidebar').append(canvas);
                    $(canvas).on('click', function() {
                        pageNum = i;
                        renderPage(pageNum, scale);
                    });
                });
            });
        }
    }

    $('#file-upload').on('change', function(e) {
        var file = e.target.files[0];
        if (file.type !== 'application/pdf') {
            alert(file.name + " is not a PDF.");
            return;
        }
        var fileReader = new FileReader();
        fileReader.onload = function() {
            var typedarray = new Uint8Array(this.result);
            pdfjsLib.getDocument({data: typedarray}).promise.then(function(pdfDoc_) {
                pdfDoc = pdfDoc_;
                renderPage(pageNum, scale);
                document.getElementById('page-num').textContent = '1 / ' + pdfDoc.numPages;
                renderThumbnails();
            });
        };
        fileReader.readAsArrayBuffer(file);
    });

    $('#prev').on('click', function() {
        if (pageNum <= 1) {
            return;
        }
        pageNum--;
        renderPage(pageNum, scale);
    });

    $('#next').on('click', function() {
        if (pageNum >= pdfDoc.numPages) {
            return;
        }
        pageNum++;
        renderPage(pageNum, scale);
        // Call updateInsights to simulate live insights update
        updateInsights();
        
    });

    $('#zoom-in').on('click', function() {
        scale *= 1.1;
        renderPage(pageNum, scale);
    });

    $('#zoom-out').on('click', function() {
        scale /= 1.1;
        renderPage(pageNum, scale);
    });

    $('#fit-screen').on('click', function() {
        // Ensure the PDF is loaded
        if (pdfDoc) {
            pdfDoc.getPage(pageNum).then(function(page) {
                var viewerWidth = $('#pdf-viewer').width();
                var viewerHeight = $('#pdf-viewer').height();
                var pageViewport = page.getViewport({scale: 1.0});
                var scaleX = viewerWidth / pageViewport.width;
                var scaleY = viewerHeight / pageViewport.height;
                var scaleToFit = Math.min(scaleX, scaleY);
                renderPage(pageNum, scaleToFit);
            });
        }
    });

    function updateInsights() {
        $("#insights-panel").show();
        const insightsData = [
            "20 students submitted quiz",
            "Topics: Lambda, RDS",
            "90% of students are thorough with the Lambda concept.",
            "50% of students have not understood the concept well."
        ];

        const insightsContent = document.getElementById('insights-content');
        insightsContent.innerHTML = ''; // Clear existing content

        insightsData.forEach((insight, index) => {
            setTimeout(() => {
                const p = document.createElement('p');
                p.textContent = insight;
                p.style.display = 'none';
                insightsContent.appendChild(p);
                $(p).fadeIn();
            }, index * 3000); // Flash new insights one by one, 3 seconds apart
        });
}
});
