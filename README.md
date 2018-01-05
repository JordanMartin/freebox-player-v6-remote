# freebox-player-v6-remote
Contrôle du player de la freebox V6 via HTTP

# Prérequis
Pour utiliser la télécommande virtuel, il faut deux informations : 
- Le nom d'hôte : hd1.freebox.fr (hd2.freebox.fr pour le 2ème player).
- Le code de la télécommande se trouve sur le player dans **Réglages > Système > Information Freebox Player et Server > Code télécommande réseau**

# Exemple
```javascript
const remote = new FreeboxV6Remote('hd1.freebox.fr', 2508264);

// Alumer / éteindre le player
remote.power();

// Touche 1
remote.key(1);

// Se rendre sur la radio
remote.sequence('home wait5000 red right right down down ok')
    .then(() => console.log('séquence terminée'));
```