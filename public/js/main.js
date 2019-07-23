$(document).ready(function() {
  $('.delete-article').on('click', function(e) {
    $target = $(e.target)
    const id = $target.attr('data-id')
    console.log(id)
    $.ajax({
      async: true,
      type: 'DELETE',
      url: '/article/' + id,
      success: function(response) {
        alert(response)
        window.location.href = '/'
      },
      error: function(err) {
        console.log(err)
      }
    })
  })
})
