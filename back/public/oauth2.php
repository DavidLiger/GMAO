<script src="https://code.jquery.com/jquery-3.7.1.js"></script>
<div>
	Test connexion <span id="test-result"></span>
</div>
<script>
	const base_url = "http://<?= $_SERVER['HTTP_HOST'] ?>";
	const client_id = "biotrade";
	const client_secret = "5a9266bea8d2d9a167784c34d7fdf2b925e0ee2d1c87ca59293788885aa62a3b1a21781596b3243ccf8c958ba22a4a6179ee97491d916dfb0bb9482dba38e51b";
	const token_endpoint = base_url + "/token";
	const grant_type = "password";
	var access_token = null;
	var refresh_token = null;

	$.ajax({
		url: token_endpoint,
		method: "post",
		data: {
			client_id: client_id,
			client_secret: client_secret,
			grant_type: grant_type,
			// scope: 'public',
			username: 'demo',
			password: 'biotrade'
		},
		success: (response) => {
			access_token = response.access_token;
			if (typeof response.refresh_token != 'undefined')
				refresh_token = response.refresh_token;
			
			if (false /*refresh_token*/){
				console.log('Trying to request refresh token');
				$.ajax({
					url: endpoint,
					method: "post",
					data: {
						client_id: client_id,
						client_secret: client_secret,
						grant_type: "refresh_token",
						refresh_token: refresh_token
					},
					success: (response) => {
						access_token = response.access_token;
						if (typeof response.refresh_token != 'undefined')
							refresh_token = response.refresh_token;
					},
					error: (error) => {
						console.error('On requesting refresh_token', error);
					}
				});
			}
			
			// print out access token
			$('#test-result').html(access_token);
			
			// Request user details
			$.ajax({
				url: base_url + "/utilisateur" 
			});
		},
		error: (error) => {
			console.error('On requesting "' + grant_type + '" grant type', error);
		}
	});
</script>