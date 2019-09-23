$(document).ready(function() {
	$('.nav-trigger').click(function() {
		$('.side-nav').toggleClass('visible');
	});
	
	function loadLinks()
	{
		document.querySelectorAll("nav ul li").forEach(item => 
		{
			const link = item.querySelector("a");
			const _link = link.href.replace(window.location.origin, "");
			if(_link == window.location.pathname)
			{
				item.classList.toggle("active");
			}
		});
	}

	function UrlTracking()
	{
		const path = document.location.pathname.split('/').filter(item => item != "");
		const _path = document.querySelector(".main-content .title .path");
		var pathStr = "";
		path.forEach(p => 
		{
			if(path.indexOf(p) == 0)
			{
				pathStr += `../${p}/`;
			}
			else
			{
				pathStr += `${p}/`;
			}
			var link = document.createElement('a');
			link.href = pathStr;
			var span = document.createElement('span');
			span.innerText = p;
			link.appendChild(span);
			_path.appendChild(link);
		});
	}

	UrlTracking();

	loadLinks();


});