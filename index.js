const FreeboxV6Remote = require('./src/FreeboxV6Remote');

/* 
Exemple
-------
const remote = new FreeboxV6Remote('hd1.freebox.fr', 2508264);
// Alumer / éteindre
remote.power();
// Se rendre sur la radio
remote.sequence('home wait5000 red right right down down ok');
// Affiche des infos sur le player et le server
remote.sequence('home wait5000 red left left left left down down down down down down down ok wait3000 down down down ok');
*/

module.exports =  FreeboxV6Remote;