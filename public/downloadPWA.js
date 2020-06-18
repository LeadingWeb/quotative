let $add;
let deferredPrompt;

$add = document.getElementById('addHome');
// console.log($add);
$add.style.cssText = "font-size: 1.2rem; padding: 7px; border-top-right-radius: 7%; border: none; border-top: 0.5px solid #3f3f44; border-right: 0.5px solid #3f3f44; line-height: 1.7rem; background: #f7f7f7; text-transform: lowercase; letter-spacing: 0.9rem; margin-top: 20px; box-shadow: 2px 2px 2px #3f3f4411; transition: 0.5s ease-in-out; z-index: 2;";
$add.style.display = 'none';


window.addEventListener('beforeinstallprompt', (e) => {
    
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    console.log(e);
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Update UI to notify the user they can add to home screen
    $add.style.display = 'block';
    
    $add.addEventListener('click', (e) => {
        console.log(deferredPrompt);
        // e.preventDefault();
        console.log('clicked', $add);
        // alert('clicked');
        // hide our user interface that shows our A2HS button
        $add.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
    $add.addEventListener('touched', (e) => {
        console.log($add);
        e.preventDefault();
        console.log('touched');
        // alert('touched');
        // hide our user interface that shows our A2HS button
        $add.style.display = 'none';
        // Show the prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            } else {
                console.log('User dismissed the A2HS prompt');
            }
            deferredPrompt = null;
        });
    });
});

window.addEventListener('appinstalled', (evt) => {
    // Log install to analytics
    console.log('INSTALL: Success');
});

