/**
 * Created by salvob on 28/06/2017.
 */
/*scroll up*/

var options = {
    useEasing: true,
    useGrouping: true,
    separator: ',',
    decimal: '.'
};
var songs = new CountUp("songs", 0, 4159, 0, 2.5, options);
var artists = new CountUp("artists", 0, 1152, 0, 2.5, options);
var words = new CountUp("words", 0, 1012649, 0, 2.5, options);

$(window).scroll(function () {
    var hT = $('#songs').offset().top,
        hH = $('#songs').outerHeight(),
        wH = $(window).height(),
        wS = $(this).scrollTop();
    if (wS > (hT  - wH)) {
        songs.start();
        artists.start();
        words.start();
    }
});
