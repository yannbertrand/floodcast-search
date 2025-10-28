import { describe, expect, it } from 'vitest';
import { getWikipediaInfo, normalizeInfos } from './get-wikipedia-info.ts';

// from https://fr.wikipedia.org/w/index.php?title=FloodCast&action=edit&section=13
const wikipediaInfo = `== Liste des épisodes ==
''(Mis à jour le {{date|21/07/2025}})''
{{Pertinence section|date=janvier 2023}}
{{Boîte déroulante/début|titre=Liste des épisodes}}
{| class="wikitable"
|+ Liste des épisodes du Floodcast
|-
! N° de l'épisode !! Nom de l'épisode !! Date !! Durée !! Invités !! Recommandations culturelles
|-
| colspan="6" bgcolor="#AACCAA" style="text-align:center;" | '''Saison 1'''
|-
| S01E00 || Dumb Blonde Gets a Hitler Cum Moustache || {{date|22/02/2015}} || {{Heure|1|23|22|durée=oui}} || Clara Kane, Simon Mon et Lucien Maine ||
|-
| S01E01 || Les meilleures années de ta vie || {{date|07/03/2015}} || {{Heure||59|06}} || [[Mcfly et Carlito|Mcfly]], [[Taous Merakchi|Jack Parker]] et [[François Descraques]] || ''[[Birdman (film)|Birdman]]'', ''[[Les Nouveaux Héros]]'', ''[[La Reine des neiges (film, 2013)|La Reine des neiges]]'', ''[[Roi Julian ! L'Élu des lémurs]]'', ''[[Concept (jeu)|Concept]]''
|-
| S01E02 || Le Père Noël sent la pisse || {{date|05/04/2015}} || {{Heure|1|07|44|durée=oui}} || Greg Romano, Nicolas Berno et [[Vincent Tirel]] || [[The Last Man on Earth]], [[MacGruber]], "La folle histoire de Mel Brooks", [[La Dernière Folie de Mel Brooks]] et [[La Folle Histoire de l'espace]], ''[[Fast and Furious 7]]'', [[Un homme idéal (film, 2015)|Un homme idéal]], [[La Vérité sur l'affaire Harry Quebert]], [[Le Dernier Tango à Paris]], [[OlliOlli 2: Welcome to Olliwood]], [[The Jinx]], subtitlesapp
|-
| S01E03 || La bouche de Mike et le tapis || {{date|26/07/2015}} || {{Heure||55|57|durée=oui}} || Vanessa Brias, [[Éléonore Costes]], Clara Kane || ''[[Silicon Valley (série télévisée)|Silicon Valley]]'', [[Man Seeking Woman]], [[Unbreakable Kimmy Schmidt]], [[The Last Man on Earth]], [[Entourage (série télévisée)]], [[David Tennant]], ''[[Modern Family]]'', ''[[Sept Jours en enfer]]''
|-
| S01E04 || Amour-Sms.Blogspot || {{date|11/01/2016}} || {{Heure|1|13|23|durée=oui}} || [[Justine Le Pottier]], Axel Maliverney || Top 11 des films 2015
|-
| S01E05 || Fluides corporels || {{date|20/03/2016}} || {{Heure|1|16|44|durée=oui}} || [[Julien Pestel]], [[Mcfly et Carlito]], || ''[[Demain nous appartient]]'', ''[[The Voices]]'', ''[[Deadpool (film)|Deadpool]]'', ''[[Five (film, 2016)|Five]]''
|-
| S01E06 || Ponction Lambert || {{date|27/03/2016}} || {{Heure|1|18|58|durée=oui}} || [[Aude Gogny-Goubert]], David Fontao, [[Patrick Baud]] || [[Samsung Gear VR]], ''[[Au-delà du mal]]'', ''[[La Vérité sur l'affaire Harry Quebert]]''
|-
| S01E07 || Opéreuse pour enfants morts || {{date|03/04/2016}} || {{Heure|1|33|16|durée=oui}} || [[Navie]], Valentin Vincent, [[Justine Le Pottier]] || ''L'Intelligence artificielle'' (Marion Montaigne et Jean-Noël Lafargue), [[La Petite Bédéthèque des savoirs]], ''Les Chatouilles ou la Danse de la colère'' de [[Andréa Bescond]], ''Pulsions'' de [[Kyan Khojandi]], ''[[Sense8]]'', ''[[Daredevil (série télévisée)|Daredevil]]'', ''[[Batman v Superman : L'Aube de la justice]]''
|-
| S01E08 || Elie Semoun || {{date|10/04/2016}} || {{Heure||59|25|durée=oui}} || [[Freddy Gladieux]], [[Pierre Lapin (streamer)|Pierre Lapin]], Aurélien Préveaux || Dillon Cooper, ''[[Junk (album de M83)|Junk]]'' de [[M83 (groupe)|M83]], album "erreur 404" de [[Brav]], ''[[Man Seeking Woman]]'', ''[[The Witness (jeu vidéo, 2016)|The Witness]]'', ''[[Midnight Special (film)|Midnight Special]]''
|-
| S01E09 || Oh ça va… || {{date|24/04/2016}} || {{Heure|1|07|49|durée=oui}} || [[Anne-Sophie Girard]], [[Simon Astier]], Nicolas Berno || [[Saison 4 d'American Horror Story]], [[Sleep No More]], ''[[Love (série télévisée)|Love]]'', [[Grimsby : Agent trop spécial]], Auschwitz: The Nazis and 'The Final Solution', [[Les lundis au soleil]], Fresh Dressed, [[Mauvais Genre (bande dessinée)]], [[Hoop Dreams]], [[Le Sommet des dieux]], Backstreet Boys: Show 'Em What You're Made Of, ''[[Les Visiteurs : La Révolution]]'', ''[[The Dictator (film, 2012)|The Dictator]]''
|-
| colspan="6" bgcolor="#AAAACC" style="text-align:center;" | '''Saison 2'''
|-
| S02E01 || Live @ Frames 2016 || {{date|13/09/2016}} || {{Heure||52|04|durée=oui}} || [[Patrick Baud]], [[Charlie Danger]], [[Slimane-Baptiste Berhoun]], Thomas Hercouet, [[François Descraques]] ||
|-
| S02E02 || Postiche de Fouffe || {{date|29/09/2016}} || {{Heure|1|11|14|durée=oui}} || Maud Givert, Sophie Riche, [[Sophie-Marie Larrouy]] || [[The Get Down]], [[NBA 2K]], [[Divines]], [[Juste la fin du monde]], [[Haroun (humoriste)|Haroun]], Jean Philippe De Tinguy, Yes Please de [[Amy Poehler]], Kardashian clips sur Instagram, [[Dans la légende]]
|-
| S02E03 || L'amour, c'est comme chier || {{date|06/03/2017}} || {{Heure|1|48|15|durée=oui}} || Teddy Férent, [[Audrey Pirault]], [[Julien Pestel]] || [[Abstract : L'art du design]], [[The OA]], [[Last Chance U]], [[Fearless (série télévisée)]], [[Split]], [[Lego Batman, le film]], [[Silence (film, 2016)]], [[XXX: Reactivated]], [[Moonlight (film, 2016)]], [[Ouvert la nuit]], [[Premier contact]], [[Bob's Burgers]], [[Utopia (série télévisée)]]
|-
| S02E04 || Nique ta Mesmer || {{date|22/03/2017}} || {{Heure|2|03|41|durée=oui}} || [[Dan Gagnon]], Anthony Mirelli || [[RimWorld]], [[Baskets]], [[Snipperclips : Les deux font la paire]], [[Souvenirs de Gravity Falls]], The Leather Special d'[[Amy Schumer]], 3 Mics de [[Neal Brennan]], [[T2 Trainspotting]]
|-
| colspan="6" bgcolor="#CCBBAA" style="text-align:center;" | '''Saison 3'''
|-
| S03E01 || La Rentrée des Connards || {{date|17/09/2017}} || {{Heure|1|51|34|durée=oui}} || [[Jérôme Niel]], [[Ornella Fleury]] et Gaël Mectoob || One More Joke, [[Argo (film)]], [[120 Battements par minute]], [[Hannibal (série télévisée)]], [[Ozark]], [[Get Out]], [[The Town]]
|-
| S03E02 || Les Pires Soirées || {{date|09/10/2017}} || {{Heure|2|27|57|durée=oui}} || [[Marina Rollman]], Anis Rhali, Tom Evrard || Dissect (podcast), les spectacles de [[Gad Elmaleh]], [[Blade Runner 2049]], Bon chien chien de [[Thomas VDB]], [[Le Redoutable (film)]], Theft by Finding: Diaries (1977–2002), Discographie de [[Kanye West]], [[Buffalo '66]], [[Les Trois Frères]], Faire un film de [[Sidney Lumet]], ''[[Dark Souls]]''
|-
| S03E03 || Le Docteur Guigui et nos enfances || {{date|03/12/2017}} || {{Heure|2|21|59|durée=oui}} || [[Antoine Daniel]], Antoine Piombino et Luciole || [[The Young Pope]], [[Watchmen : Les Gardiens]], [[Watchmen]], Jim & Andy: The Great Beyond, [[Man on the Moon]], [[Monsieur Flap]]
|-
| S03E04 || La Liste de la Rage || {{date|11/12/2017}} || {{Heure|2|15|32|durée=oui}} || [[Bruno Muschio|Navo]], Léopold Lemarchand || L'histoire de Kalief Browder, [[Juliette Armanet]], ''[[Six Feet Under (série télévisée)|Six Feet Under]]'', ''[[The Leftovers]]'', Le Club, Sur les épaules de Darwin
|-
| S03E05 || Ne me quitte pas (malgré la sueur) || {{date|18/12/2017}} || {{Heure|2|03|10|durée=oui}} || [[Kyan Khojandi]], [[Alison Wheeler]] et Timothée Hochet || ''[[Papa (film, 2005)|Papa]]'', [[The Jinx]], ''[[Coco (film, 2017)|Coco]]'', ''[[Lion (film, 2016)|Lion]]'', [[Judd Apatow]] : The Return
|-
| S03E06 || Tu te prends pour un Jedi ou quoi ? (HS Star Wars) || {{date|08/01/2018}} || {{Heure|3|21|04|durée=oui}} || Vesper, Lucien Maine et Joe Hume ||
|-
| S03E07 || Le Club du Petit-Déjeuner || {{date|15/01/2018}} || {{Heure|2|16|35|durée=oui}} || Jérémie Dethelot, [[Pierre Lapin (streamer)|Pierre Lapin]], [[Sylvqin]] || ''[[Manhunt (série télévisée)|Manhunt]]'', Mourn de Corbin, [[World War Hulk]], ''[[Dirk Gently, détective holistique (série télévisée)|Dirk Gently, détective holistique]]'', ''Tales from the script''
|-
| S03E08 || On prend vos appels et on lit nos sketchs || {{date|25/01/2018}} || {{Heure|1|27|08|durée=oui}} || - || Teenage Engineering, Nouvelle école (podcast)
|-
| S03E09 || Pas de thème mais un pipeau || {{date|05/02/2018}} || {{Heure|1|49|03|durée=oui}} || [[Taous Merakchi]] (Jack Parker), [[Julien Pestel]], Valentin Vincent || [[Firewatch]], ''[[The Fundamentals of Caring]]'', ''[[The Good Place]]'', The Disaster Artist, [[Une drôle de fin]], Meddling Kids
|-
| S03E10 || Causerie avec Ina Mihalache || {{date|19/02/2018}} || {{Heure|1|21|42|durée=oui}} || [[Ina Mihalache]], dit Solange te Parle ||
|-
| S03E11 || Joyeux Anniversaire Suricate || {{date|26/02/2018}} || {{Heure|3|13|10|durée=oui}} || [[Vincent Tirel]], [[Julien Josselin]] et [[Raphaël Descraques]] || ''[[Revenge (film, 2017)|Revenge]]'', ''[[Sparring (film)|Sparring]]'', ''[[The Thing (film, 1982)|The Thing]]'', ''[[Phantom Thread]]'', ''[[Undertale]]'', ''[[Swiss Army Man]]'', ''[[Colossal (film)|Colossal]]''
|-
| S03E12 || C'est le Floodcast de trop || {{date|02/04/2018}} || {{Heure|2|11|15|durée=oui}} || [[Sébastien Chassagne]], Marjorie LeNoan, [[Simon Astier]] || [[Sleeping Beauties]], Orgines ([[Baptiste Lecaplain]]), ''[[Zaï zaï zaï zaï]]'', ''[[Barry (série télévisée)|Barry]]'', ''[[Extras (série télévisée)|Extras]]'', [[Ash vs. Evil Dead]], [[Three Billboards : Les Panneaux de la vengeance]], Chien (Samuel Benchetrit), ''[[Ready Player One (film)|Ready Player One]]''
|-
| S03E13 || Globophobie et Crucifix dans la chatte || {{date|23/05/2018}} || {{Heure|2|37|37|durée=oui}} || [[Pénélope Bagieu]], [[Dédo]], [[PV Nova]] || Les Génies du mal, Is This Guy For Real?: The Unbelievable Andy Kaufman (de Box Brown), Les Yeux (de [[Slimane-Baptiste Berhoun]]), Jean Doux et le mystère de la disquette molle (de [[Philippe Valette]]), Super mamans (The Letdown)
|-
| colspan="6" bgcolor="#D34455" style="text-align:center;" | '''Saison 4'''
|-
| S04E01 || Real Player One || {{date|03/09/2018}} || {{Heure|3|16|33|durée=oui}} || [[Davy Mourier]], [[Jhon Rachid]], [[François Descraques]] et Baptiste Lorber ||
|-
| S04E02 || Bilan des Vacances || {{date|10/09/2018}} || {{Heure|2|14|08|durée=oui}} || [[Céline Tran]], [[Navie]], Aurélien Préveaux || Gérard, cinq années dans les pattes de Depardieu (de [[Mathieu Sapin]]), Les Bleus - Une autre histoire de France (documentaire), [[Dark Tourist]], Nanette (de [[Hannah Gadsby]]), [[I Feel Pretty]], Change ma vie (podcast), [[Creep 2]], [[Larry et son nombril]]
|-
| S04E03 || On prend vos appels 2 || {{date|17/09/2018}} || {{Heure|1|00|29|durée=oui}} || ||
|-
| S04E04 || A l'encre de mon sperme || {{date|24/09/2018}} || {{Heure|2|03|53|durée=oui}} || [[Natoo]], Lucien Maine, [[Freddy Gladieux]] || ''[[RuPaul's Drag Race]]'', ''[[Aggretsuko]]'', ''[[Groom (web-série)|Groom]]'', ''Kiwami Japan'', ''[[Fallout 4]]'', ''The Adventure Zone'' (podcast), ''Bouffons'' (podcast), ''Qui m’a Filé la Chlamydia ?'' (podcast)
|-
| S04E05 || Lapins dans le vagin (EN PUBLIC AU FRAMES FESTIVAL) || {{date|01/10/2018}} || {{Heure|1|21|40|durée=oui}} || [[Patrick Baud]], [[Bruno Muschio]], Valentin Vincent || ''[[Kiss Me First]]'', Court-métrages du [[Frames Festival]] (2018), ''[[Marvel's Spider-Man]]'', ''{{3e}} droite'' de François Descraques
|-
| S04E06 || Bienvenue au Grand Hôtel (Spécial Groom) || {{date|22/10/2018}} || {{Heure|2|13|28|durée=oui}} || [[Jérôme Niel|Jérome Niel]], [[Vincent Tirel]], Axel Maliverney || ''[[Dark Tourist]]'', [[Tickled]], [[First Man : Le Premier Homme sur la Lune (film)]], Spectacles de [[Bo Burnham]], [[Le monde est à toi]], [[Cobra Kai]], Skorpios au loin
|-
| S04E07 || Spiritisme à la merde || {{date|29/10/2018}} || {{Heure|2|10|30|durée=oui}} || [[Jonathan Cohen]], [[Laura Felpin]], [[Jérémie Galan]] || Est-ce qu’on peut parler d’autre chose ? (de [[Roz Chast]]), [[Private Life]], Les feux de l'amour et du hasard, Sinema (chaine YouTube)
|-
| S04E08 || Pas n'importe quel balai (HS Harry Potter) || {{date|15/11/2018}} || {{Heure|3|29|19|durée=oui}} || [[Julien Josselin]], Mélody Collange, Clara Lesage et Vanessa Brias ||
|-
| S04E09 || Tenia, un film Pixar || {{date|18/12/2018}} || {{Heure|1|54|35|durée=oui}} || Guilhem Malissen, [[Pierre Lapin (streamer)|Pierre Lapin]] || [[Bodyguard (série télévisée)]], [[Damso]], Peaceful Cuisine (YouTube),[[Spider-Man: New Generation]], [[Please Like Me]], [[Studio 60 on the Sunset Strip]], [[the Good Place]]
|-
| S04E10 || J'ai le froc plein de merde || {{date|23/12/2018}} || {{Heure|2|15|17|durée=oui}} || Amaury Magne, Kalindi Ramphul, Queen Camille, Jean-Baptiste Toussaint || ''Riviera Détente'' (Podcast), ''[[Border (film, 2018)|Border]]'', ''Karoo'' (de Steve Tesich), ''[[Dix pour cent]]'', ''[[Phantom Thread]]'', ''A Different Age'' (de Nick Rattigan), ''[[Les Intrus (bande dessinée)|Les Intrus]]'', ''100% Fresh'' ([[Adam Sandler]])
|-
| S04E11 || Romantique Intrusif || {{date|22/01/2019}} || {{Heure|2|30|41|durée=oui}} || [[Baptiste Lecaplain]], Robinson Latour, Aurélien Préveaux ||
|-
| S04E12 || Kaamelto || {{date|28/01/2019}} || {{Heure|2|31|39|durée=oui}} || Anna Apter, Marjorie LeNoan, Lucien Maine ||
|-
| S04E13 || Et si on veut pas être résistant ? (Spécial "Les Emmerdeurs") || {{date|04/02/2019}} || {{Heure|2|07|46|durée=oui}} || [[Justine Le Pottier]], Paul Scarfoglio, Valentin Vincent et [[Camille Claris]] || [[Border (film, 2018)]], [[Respire (film, 2014)]], [[Green Book : Sur les routes du Sud]], [[L'Échiquier du mal]], [[Pile poil]], [[Mon bébé (film, 2019)]], [[
2001, l'Odyssée de l'espace]], [[Sex Education]]
|-
| S04E14 || Avec le Palmashow || {{date|11/02/2019}} || {{Heure|1|09|37|durée=oui}} || [[David Marsais]], [[Grégoire Ludig]] || La chaine YouTube Yes Vous Aimes, ''Trigger Warning with Killer Mike'', ''[[Green Book : Sur les routes du Sud]]'', ''[[Black Snake, la légende du serpent noir]]'', ''[[De l'autre côté du miroir (émission de télévision)|De l'autre côté du miroir]]'', Copie Conforme de [[Patrick Sébastien]]
|-
| S04E15 || Une Moitié des RRRrrrrobins Des Bois || {{date|18/02/2019}} || {{Heure|1|01|25|durée=oui}} || [[Pierre-François Martin-Laval]], [[Maurice Barthélemy (acteur)|Maurice Barthélémy]], [[Élise Larnicol|Elise Larnicol]] ||
|-
| S04E16 || Télépathe pour Chiens || {{date|18/03/2019}} || {{Heure|2|29|39|durée=oui}} || [[Audrey Pirault]], Gaël Mectoob, [[Justine Le Pottier]] || ''[[Triple Frontière (film)|Triple Frontière]]'', ''[[Le Chant du loup (film, 2019)|Le Chant du loup]]'', Aux quatre coins de la comédie, [[Grâce à Dieu]], [[Ape Out]], [[Ni juge, ni soumise]], [[Ma vie avec John F. Donovan]], ''Transfert'' (podcast), ''Heal'' (film), ''[[La Villa des cœurs brisés]]''
|-
| S04E17 || Ces Œuvres qui ont Marqué nos Vies || {{date|}}{{date|}}{{date|25/03/2019}} || {{Heure|2|36|52|durée=oui}} || [[Manon Bril]], le Capitaine du Nexus VI, Jean-Baptiste Siraudin || [[Killer Inside]], Liziqi (chaine Youtube), Invisibilia (podcast), Gringo: The Dangerous Life of John McAfee, High Concept: Don Simpson and the Hollywood Culture of Excess, ''[[Love, Death and Robots]]'', ''Latium'' (série de livres), Tropique du Splendid, essai sur la France des Bronzés
|-
| S04E18 || Les Raisons de la Colère || {{date|01/04/2019}} || {{Heure|2|19|26|durée=oui}} || [[Sophie-Marie Larrouy]], [[Jérôme Niel]], Tom Evrard || [[Baba Is You]], Premiere Classics (magazine), Friedkin Connection : Les mémoires d'un cinéaste de légende, Mal(à)laise (épisode 1) de [[Sefyu]], [[Le Convoi de la peur]]
|-
| S04E19 || We are Groot (HS Marvel Cinematic Universe) || {{date|15/04/2019}} || {{Heure|3|27|58|durée=oui}} || Vesper, Joe Hume et Ben Renaut ||
|-
| S04E20 || Joyeux Bordel || {{date|22/04/2019}} || {{Heure|2|47|55|durée=oui}} || [[Mister V]], Thomas Gauthier, [[Freddy Gladieux]] || Alphi (chaîne Youtube), Sylvqin (chaîne Youtube), La nuit est une panthère (de [[Les Louanges]]), [[Les Nouveaux Sauvages]], True story et Maintenant vous savez (podcasts du Bababam), À travers (de Tom Haugomat)
|-
| S04E21 || Deux Heures de Vicos || {{date|01/05/2019}} || {{Heure|2|07|14|durée=oui}} || Antoine, Sarah, Julie et Greg du podcast {{nobr|2 heures}} de perdues, || Calmos (podcast), I Think You Should Leave with Tim Robinson, Copain du Web, [[The Defiant Ones (documentaire)]], Sun Records (série), [[Better Things]], [[Pose (série télévisée)]]
|-
| S04E22 || C'est Le Métier Qui Rentre || {{date|20/05/2019}} || {{Heure|2|14|55|durée=oui}} || Akim Omiri, Luciole, Aslak Lefebvre || [[Days Gone]], Radiolab (podcast), Hollywood Babble-On (podcast)
|-
| S04E23 || Mauvais Titre de Porno || {{date|17/06/2019}} || {{Heure|2|35|42|durée=oui}} || [[Babor Lelefan|Babor]], Mélody Collange, JB de Tales from The Click || [[Fiche de lecture (recueil)]], [[Rocketman (film)]]
|-
| S04E24 || Pisser dans une Passoire || {{date|24/06/2019}} || {{Heure|2|27|41|durée=oui}} || [[Éléonore Costes]], Vanessa Brias, Clara Lesage || [[Be My Eyes]], [[Rocketman (film)]], [[Fleabag]], [[Booksmart]]
|-
| S04E25 || De Grandes Responsabilités (HS Spider-Man) || {{date|15/07/2019}} || {{Heure|2|59|42|durée=oui}} || Joe Hume et Ben Renaut ||
|-
| colspan="6" bgcolor="#93D455" style="text-align:center;" | '''Saison 5'''
|-
| S05E01 || MEGAGAF || {{date|19/08/2019}} || {{Heure|2|17|59|durée=oui}} || [[Shirley Souagnon]], [[Yacine Belhousse]], [[Dédo]] ||
|-
| S05E02 || Un Doigt dans le Cul donne la Météo || {{date|26/08/2019}} || {{Heure|2|45|54|durée=oui}} || [[Roxane Bret]], Lucien Maine, Valentin Vincent et le [[Père Fouras]] ||
|-
| S05E03 || Du Guacamole au Burning Man || {{date|02/09/2019}} || {{Heure|1|57|19|durée=oui}} || [[Kyan Khojandi]], Ludoc, Vanessa Brias, [[Jérémie Galan]] et Tom Evrard ||
|-
| S05E04 || La Grande Classe || {{date|09/09/2019}} || {{Heure|1|32|36|durée=oui}} || [[Ludovik]], [[Caroline Anglade]], [[Jérôme Niel]] et Nicolas Berno ||
|-
| S05E05 || Michel Sardou nous hait || {{date|16/09/2019}} || {{Heure|1|34|10|durée=oui}} || [[Pierre Lapin (streamer)|Pierre Lapin]], et [[Michel Sardou]] || ''[[The Affair]]'', ''En verre et contre tous'', ''Hyperdrive'', ''Paper Tiger'' (de [[Bill Burr]]), ''How Neal Feel'' (podcast)
|-
| S05E06 || Ils ont volé mon Chocolat les Bâtards || {{date|23/09/2019}} || {{Heure|1|26|26|durée=oui}} || [[Hakim Jemili]], Insaf Oo ||
|-
| S05E07 || OUI Jacques Chirac || {{date|07/10/2019}} || {{Heure|2|15|23|durée=oui}} || [[Mehdi Maïzi]], Aurélien Préveaux, Sylvqin ||
|-
| S05E08 || Maudit Collier de Perles (HS Batman) || {{date|14/10/2019}} || {{Heure|3|33|22|durée=oui}} || Vesper, Joe Hume et Ben Renault ||
|-
| S05E09 || En Public au Bataclan || {{date|28/10/2019}} || {{Heure|1|42|26|durée=oui}} || [[Monsieur Poulpe]], [[Mister V]], [[Éléonore Costes]] et [[Baptiste Lecaplain]] ||
|-
| S05E10 || Les Dessous des Coulisses du Making-Of du Live || {{date|04/11/2019}} || {{Heure|1|21|01|durée=oui}} || ||
|-
| S05E11 || Branle un Avion || {{date|18/11/2019}} || {{Heure|2|19|36|durée=oui}} || [[Alison Wheeler]], [[Anne-Sophie Girard]], Léopold Lemarchand ||
|-
| S05E12 || OK Booder || {{date|25/11/2019}} || {{Heure|2|14|51|durée=oui}} || [[Myd|MYD]], Lou Howard, [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| S05E13 || Carrelage d'Hôtel || {{date|09/12/2019}} || {{Heure|1|19|55|durée=oui}} || [[Constance Labbé]], Axel Maliverney ||
|-
| S05E14 || Chernobyl du Bigdil || {{date|16/12/2019}} || {{Heure|1|36|54|durée=oui}} || [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| S05E15 || Doigter un Chat || {{date|13/01/2020}} || {{Heure|2|31|04|durée=oui}} || Sophie Garric, [[Julien Josselin]], Gaël Mectoob ||
|-
| S05E16 || Floodcast Raconte (épisode spécial) || {{date|20/01/2020}} || {{Heure||37|03|durée=oui}} || [[Laura Felpin]], [[Julien Pestel]] ||
|-
| S05E17 || Trump il est Orange || {{date|27/01/2020}} || {{Heure|1|57|02|durée=oui}} || [[Thomas VDB]], Ambre Larrazet, [[François Descraques]] ||
|-
| S05E18 || Un Micro et une Bouteille que tu tiens par le Bouchon || {{date|03/02/2020}} || {{Heure|1|44|24|durée=oui}} || [[Fanny Ruwet]], [[Thomas Wiesel]], Ghislan Blique ||
|-
| S05E19 || Je suis Woody, salut, salut, salut (HS Pixar) || {{date|02/03/2020}} || {{Heure|2|44|38|durée=oui}} || [[François Descraques]], Valentin Vincent et Timothée Hochet ||
|-
| S05E20 || De Retour En Public || {{date|16/03/2020}} || {{Heure|1|38|27|durée=oui}} || [[Marina Rollman]], [[Alison Wheeler]], [[Hakim Jemili]], [[Patrick Baud]] et [[Simon Astier]] ||
|-
| S05E21 || Gratin Confiné || {{date|23/03/2020}} || {{Heure|1|08|46|durée=oui}} || Natoo, Léopold Lemarchand, McFly, Pierre Lapin, Julien Paniac, [[Maxence (chanteur)|Maxence Lapérouse]], Dan Gagnon, Clara Lesage et ma mère ||
|-
| S05E22 || La COVID d'Adèle || {{date|12/04/2020}} || {{Heure|1|18|09|durée=oui}} || ||
|-
| S05E23 || Bon Anniversaire Adrien Ménielle || {{date|11/05/2020}} || {{Heure||57|3|durée=oui}} || [[Patrick Baud]], Julien Ménielle, JB de Tales From the Click, [[Domingo (streamer)|P.A Domingo]], [[Squeezie]], [[Bigflo et Oli|BigFlo]], [[Mehdi Maïzi]], [[Laura Felpin]], [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| S05E24 || Câble d'Iphone dans l'Urètre || {{date|15/06/2020}} || {{Heure|2|24|48|durée=oui}} || [[Cyprien Iov]], Marjorie LeNoan, Jérémie Dethelot, [[Justine Le Pottier]] ||
|-
| S05E25 || Une Renaut 21 En Feu || {{date|22/06/2020}} || {{Heure|1|25|08|durée=oui}} || [[Alban Lenoir]], [[Sébastien Lalanne]], Guillaume Pierret, Robinson Latour ||
|-
| S05E26 || Le Puy du Flood || {{date|29/06/2020}} || {{Heure|2|13|05|durée=oui}} || [[Doully]], [[Audrey Pirault]], Guillaume Brouzes ||
|-
| S05E27 || Flood Rap Jeu || {{date|09/07/2020}} || {{Heure|1|31|01|durée=oui}} || Yerim Sar, Ngiraan Fall, [[Mehdi Maïzi]], Aslak Lefevre ||
|-
| S05E28 || Anguille dans le Cul || {{date|29/07/2020}} || {{Heure|1|53|23|durée=oui}} || [[Maghla]], [[Emy LTR]], Taous Merakchi ||
|-
| S05E29 || Sexe, Drogue et Disneyland || {{date|10/08/2020}} || {{Heure|1|57|29|durée=oui}} || [[Panayotis Pascot]], [[Alex Ramirès]], Anis Rhali ||
|-
| colspan="6" bgcolor="#71B549" style="text-align:center;" | '''Saison 6'''
|-
| S06E01 || La Teub à XDDL || {{date|07/09/2020}} || {{Heure|2|08|48|durée=oui}} || [[Morgane Cadignan]], [[Freddy Gladieux]], Aurélien Préveaux ||
|-
| S06E02 || Ollie et l'Alien || {{date|14/09/2020}} || {{Heure||54|06|durée=oui}} || David Combet et Davy Mourier ||
|-
| S06E03 || Génération Ben Laden || {{date|28/09/2020}} || {{Heure|2|47|04|durée=oui}} || [[Xavier Dang|Mister MV]], [[Antoine Daniel]], Florence (Angle Droit) ||
|-
| S06E04 || Deux Teufeurs Pas Purs || {{date|03/11/2020}} || {{Heure|1|13|28|durée=oui}} || ||
|-
| S06E05 || Yves Montand Mal Fait || {{date|23/11/2020}} || {{Heure|2|27|38|durée=oui}} || [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| S06E06 || Donne ton sperme t'en as plein ! || {{date|25/01/2021}} || {{Heure|1|49|41|durée=oui}} || [[Bérengère Krief]], [[Ben Mazué]], [[Marine Baousson]] ||
|-
| S06E07 || Burrito au Placenta || {{date|08/02/2021}} || {{Heure|1|27|54|durée=oui}} || Lucas Pastor, Jenny Letellier, Valentin Jean ||
|-
| S06E08 || Les Crocs de Michel Sardou || {{date|29/03/2021}} || {{Heure|2|04|22|durée=oui}} || Antoine Piombino, [[Justine Le Pottier]], Teddy Férent ||
|-
| S06E09 || Sucer le Cul d'un Ortolan || {{date|05/04/2021}} || {{Heure|2|05|53|durée=oui}} || Julien Granel, Pi Ja Ma, [[Maxence (chanteur)|Maxence]] ||
|-
| S06E10 || Jeune de Moselle Recherche un Mec Mortel || {{date|19/04/2021}} || {{Heure|1|53|42|durée=oui}} || [[Marion Creusvaux]], [[Julien Pestel]], Valentin Vincent ||
|-
| S06E11 || Jean-Jacques Goldman te Fume || {{date|03/05/2021}} || {{Heure|1|55|44|durée=oui}} || [[Lison Daniel]], [[Myd]], [[Laura Felpin]] ||
|-
| S06E12 || Colostomie Bugsy || {{date|10/05/2021}} || {{Heure|2|03|57|durée=oui}} || [[Benjamin Tranié]], Morgane Cadignan, [[Jérôme Niel]] ||
|-
| S06E13 || Jean Luc Mélange-Chouette || {{date|24/05/2021}} || {{Heure|1|26|49|durée=oui}} || ||
|-
| S06E14 || Origine Mytho || {{date|07/06/2021}} || {{Heure|2|11|00|durée=oui}} || [[Sébastien Chassagne]], [[Sophie-Marie Larrouy]], Lucien Maine ||
|-
| S06E15 || Le Maxi Best-Of de la Route des Vacances || {{date|26/07/2021}} || {{Heure|4|23|02|durée=oui}} || ||
|-
| colspan="6" bgcolor="#C1C5C9" style="text-align:center;" | '''Saison 7'''
|-
| S07E01 || Floodcast First || {{date|06/09/2021}} || {{Heure|2|11|56|durée=oui}} || [[Squeezie]], [[Natoo]], [[Myd|MYD]] ||
|-
| S07E02 || {{nobr|30 ans}} sinon rien || {{date|13/09/2021}} || {{Heure|1|53|28|durée=oui}} || Léopold Lemarchand, [[Jérôme Niel|Jérome Niel]], Axel Maliverney ||
|-
| S07E03 || Martine fait de la Wingsuit || {{date|20/09/2021}} || {{Heure|1|41|57|durée=oui}} || [[Doully]], Jean-Baptiste Toussaint, [[Ornella Fleury]] ||
|-
| S07E04 || La Vengeance du Chasseur Landais || {{date|27/09/2021}} || {{Heure|2|04|18|durée=oui}} || Horty, [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| S07E05 || Ejaculation Fécale || {{date|04/10/2021}} || {{Heure|1|14|23|durée=oui}} || [[KronoMuzik]], [[Manon Bril]], [[Patrick Baud]] ||
|-
| S07E06 || Cheh Kira || {{date|11/10/2021}} || {{Heure|1|42|29|durée=oui}} || [[Pénélope Bagieu]], Lucien Maine, Lisa Villaret, Max Mammouth ||
|-
| S07E07 || Floodcast Raconte En Public || {{date|18/10/2021}} || {{Heure||59|20|durée=oui}} || [[Aude Gogny-Goubert]], Valentin Vincent ||
|-
| S07E08 || Diplôme de Ninja || {{date|25/10/2021}} || {{Heure|1|43|11|durée=oui}} || [[Tiphaine Daviot]], [[Simon Astier]], Jérémie Dethelot ||
|-
| S07E09 || Adri Toute la Tech || {{date|01/11/2021}} || {{Heure|1|50|03|durée=oui}} || Morgane Cadignan, Julien Paniac, [[Patrick Baud]] ||
|-
| S07E10 || Bouteille de Fluides || {{date|08/11/2021}} || {{Heure|1|36|02|durée=oui}} || [[Antoine de Caunes]], [[Monsieur Poulpe]], Vanessa Brias ||
|-
| S07E11 || Tout le Monde Peut Battre Gilles Verdez || {{date|15/11/2021}} || {{Heure|1|26|13|durée=oui}} || [[Ramzy Bedia]], Baptiste Lorber, Nicolas Berno ||
|-
| S07E12 || Clovis KORNillac || {{date|22/11/2021}} || {{Heure|1|52|07|durée=oui}} || [[Thomas VDB]], [[Éléonore Costes]], et Aurélien Préveaux ||
|-
| S07E13 || Euthanasie à domicile || {{date|06/12/2021}} || {{Heure|1|52|05|durée=oui}} || [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| S07E14 || Le Noël de Quickos || {{date|13/12/2021}} || {{Heure|1|49|37|durée=oui}} || [[Domingo (streamer)|Domingo]] et [[Maxence (chanteur)|Maxence]] ||
|-
| S07E15 || Du HOUX ! || {{date|20/12/2021}} || {{Heure|2|33|20|durée=oui}} || [[Baptiste Lecaplain]], [[Doully]], [[Jérôme Niel|Jérome Niel]] ||
|-
| S07E16 || ASSASSINGE || {{date|17/01/2022}} || {{Heure|1|58|25|durée=oui}} || Jenny Letellier, [[Natoo]], Léopold Lemarchand, Aurélien Préveaux ||
|-
| S07E17 || Paf ça Ovule || {{date|24/01/2022}} || {{Heure|1|55|56|durée=oui}} || [[Audrey Pirault]], Aurélien Préveaux ||
|-
| S07E18 || Excès de Toupet || {{date|31/01/2022}} || {{Heure|1|33|53|durée=oui}} || Lucas Pastor, Timothée Hochet, Axel Maliverney ||
|-
| S07E19 || V'la les Vedettes || {{date|07/02/2022}} || {{Heure|1|13|40|durée=oui}} || [[David Marsais]] et [[Grégoire Ludig]] du [[Palmashow]] ||
|-
| S07E20 || Champion de Laser Game || {{date|14/02/2022}} || {{Heure|2|24|06|durée=oui}} || [[Ponce (streamer)|Ponce]], [[Ultia]], [[Rivenzi]] ||
|-
| S07E21 || Jay-Zazie || {{date|21/02/2022}} || {{Heure|1|58|13|durée=oui}} || [[Djilsi]], [[Mehdi Maïzi]], [[Justine Le Pottier]] ||
|-
| S07E22 || Les Z'Amis || {{date|}} || {{Heure|1|13|24|durée=oui}} || ||
|-
| S07E23 || Ca fait beaucoup là non || {{date|07/03/2022}} || {{Heure|2|09|23|durée=oui}} || [[Mister V]], [[Freddy Gladieux]] ||
|-
| S07E24 || Francis Hustler || {{date|14/03/2022}} || {{Heure|1|45|11|durée=oui}} || [[Sophie-Marie Larrouy]], Alison Chassagne ||
|-
| S07E25 || Jefferson Flamenco || {{date|21/03/2022}} || {{Heure|2|02|26|durée=oui}} || Julien Ménielle, Marie de Brauer, [[Maxime Musqua]] ||
|-
| S07E26 || Gavé au Buzz || {{date|28/03/2022}} || {{Heure|2|13|54|durée=oui}} || Maxime Biaggi, Pi Ja Ma, [[Sylvqin]] ||
|-
| S07E27 || Les Sept Ans du Floodcast || {{date|04/04/2022}} || {{Heure|1|09|20|durée=oui}} || ||
|-
| S07E28 || Monsieur Caca Président || {{date|11/04/2022}} || {{Heure|2|00|04|durée=oui}} || Jean-Baptiste Toussaint, Guigui Pop ||
|-
| S07E29 || C’est Quoi un Meme ? || {{date|18/04/2022}} || {{Heure|1|55|55|durée=oui}} || [[Éléonore Costes]], [[Sébastien Chassagne]] ||
|-
| S07E30 || Garou me Serre le Pénis || {{date|25/04/2022}} || {{Heure|2|19|06|durée=oui}} || Camille Lavabre, [[Julien Josselin]], Valentin Vincent ||
|-
| S07E31 || Chabat, Pour Dire Je t'aime || {{date|02/05/2022}} || {{Heure|3|21|34|durée=oui}} || Team Calmos (David Honnorat et Hugo Alexandre), Vesper ||
|-
| S07E32 || Réveillé dans ses Propres Fesses || {{date|09/05/2022}} || {{Heure|1|43|56|durée=oui}} || [[Jonathan Lambert]], Anna Apter, [[Kyan Khojandi]] ||
|-
| S07E33 || Narutophilie || {{date|16/05/2022}} || {{Heure|1|40|04|durée=oui}} || Gaël Mectoob, [[Justine Le Pottier]] ||
|-
| S07E34 || Loto Bouse || {{date|30/05/2022}} || {{Heure|1|36|08|durée=oui}} || Camille Fievez, [[Babor Lelefan|Babor]] ||
|-
| S07E35 || Pierre Pommade || {{date|06/06/2022}} || {{Heure|2|03|51|durée=oui}} || [[Pierre Niney]], Pi Ja Ma ||
|-
| S07E36 || Radio Libre || {{date|13/06/2022}} || {{Heure|1|39|48|durée=oui}} || ||
|-
| S07E37 || Sicile de Minibus || {{date|20/06/2022}} || {{Heure|1|43|47|durée=oui}} || [[Doully]], Axel Maliverney ||
|-
| S07E38 || Humour de Cimetière || {{date|27/06/2022}} || {{Heure|1|50|06|durée=oui}} || [[Bigflo et Oli|BigFlo]] ||
|-
| S07E39 || Le Père FouRohff || {{date|04/07/2022}} || {{Heure|1|28|51|durée=oui}} || [[Camille Combal]], [[Natoo]] ||
|-
| S07E40 || Dépenser Sans Compter (H.S Jurassic Park) || {{date|11/07/2022}} || {{Heure|2|31|38|durée=oui}} || Ben Renault, Vesper et Joe Hume ||
|-
| S07E41 || Surmulotatouille || {{date|18/07/2022}} || {{Heure|1|30|34|durée=oui}} || [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| colspan="6" bgcolor="#4985E1" style="text-align:center;" | '''Saison 8'''
|-
| S08E01 || Friendzoner un Zèbre || {{date|10/10/2022}} || {{Heure|1|50|28|durée=oui}} || [[Jérôme Commandeur]], [[Malik Bentalha]], [[Joséphine Japy]] ||
|-
| S08E02 || Donkey Kong Country || {{date|17/10/2022}} || {{Heure|1|42|53|durée=oui}} || [[Orelsan]], Clément Cotentin ||
|-
| S08E03 || Scooliose || {{date|24/10/2022}} || {{Heure|1|32|30|durée=oui}} || Tokou, Leopold Lemarchand ||[[Gagarine (film)]], [[It Takes Two (jeu vidéo)]], [[L'Innocent (film, 2022)|L'Innocent]], Les Aventures d'un scénariste à Hollywood (de [[William Goldman]]), Grand Soleil (groupe de musique)
|-
| S08E04 || Gourdapis || {{date|31/10/2022}} || {{Heure|1|34|56|durée=oui}} || [[Baptiste Lecaplain]], [[Doully]] ||
|-
| S08E05 || Patrons de l'Infotainment || {{date|07/11/2022}} || {{Heure|1|44|59|durée=oui}} || [[Justine Le Pottier]], [[Julien Josselin]], Valentin Vincent ||
|-
| S08E06 || Ça va Lille ??!! || {{date|14/11/2022}} || {{Heure|1|16|24|durée=oui}} || [[Sophie-Marie Larrouy]], [[Jérôme Niel]] ||
|-
| S08E07 || A Chaque Fois qu’on se Touche || {{date|21/11/2022}} || {{Heure|1|42|35|durée=oui}} || Antoine Piombino, Étienne 4 U ||
|-
| S08E08 || La Boîte de Jazz || {{date|28/11/2022}} || {{Heure|1|35|17|durée=oui}} || [[Audrey Pirault]], [[Simon Astier]]. Avec la participation de BigFlo, Lucas Pastor dans le rôle du Maire Geek || Enregistré à l'Olympia le {{date|18 septembre 2022}}
|-
| S08E09 || Nicolas Le Singe || {{date|05/12/2022}} || {{Heure|1|43|15|durée=oui}} || [[Morgane Cadignan]], Guigui Pop ||
|-
| S08E10 || Toulouse déteste les Vieux || {{date|12/12/2022}} || {{Heure|1|35|01|durée=oui}} || [[Bigflo et Oli|BigFlo]], [[Justine Le Pottier]] || Enregistré au Casino Barrière le {{date|10 septembre 2022}}
|-
| S08E11 || Beaucoup de Jingles || {{date|19/12/2022}} || {{Heure|1|38|41|durée=oui}} || [[Géraldine Nakache]], [[Jonathan Cohen]] ||
|-
| S08E12 || K-Maro Griezmann || {{date|26/12/2022}} || {{Heure|1|25|33|durée=oui}} || [[Laura Felpin]] et Cédric Salaun ||
|-
| S08E13 || Les Choristes Pizzas || {{date|02/01/2023}} || {{Heure|2|01|27|durée=oui}} || [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
| S08E14 || Aspirateur Coquin || {{date|09/01/2023}}|| {{Heure|1|04|39|durée=oui}} || [[Benjamin Tranié]], [[Morgane Cadignan]] ||
|-
|S08E15||Bonne Année les Tricheurs|| {{date|16/01/2023}}||{{Heure|1|50|18|durée=oui}}||Aurélien Préveaux, Anis Rhali ||
|-
|S08E16||L'Eau a un goût||{{date|23/01/2023}}||{{Heure|1|16|36|durée=oui}}||Pi Ja Ma, [[Patrick Baud]]||
|-
|S08E17||Michel Jean Hamburger||{{date|30/01/2023}}||{{Heure|2|01|12|durée=oui}}|| ||
|-
|S08E18||La Pita de Balavoine||{{date|13/02/2023}}||{{Heure|1|41|35|durée=oui}}||[[Natoo]], Mélody Collange (Mélococo)||
|-
|S08E19||Pisser dans le Canal||{{date|20/02/2023}}||{{Heure|1|42|45|durée=oui}}||Lele, [[Monsieur Poulpe]]||
|-
|S08E20||La Poucave du Christ||{{date|24/04/2023}}||{{Heure|1|45|49|durée=oui}}||Nash et Guigui Pop||
|-
|S08E21||Quoicoubeh du 113||{{date|01/05/2023}}||{{Heure|1|45|35|durée=oui}}||PiJama et Lucas Pastor||
|-
|S08E22||Copie Conforme||{{date|08/05/2023}}||{{Heure|1|42|45|durée=oui}}||Valentin Vincent et [[Justine Le Pottier]]||
|-
|S08E23||Basketteur Pro||{{date|15/05/2023}}||{{Heure|1|16|56|durée=oui}}|| ||
|-
|S08E24|| Chier un Furet ||{{date|22/05/2023}}|| {{Heure|2|08|42|durée=oui}} || [[McFly et Carlito]] ||
|-
|S08E25|| Le Perroquet de Sardou ||{{date|28/05/2023}}|| {{Heure|1|37|09|durée=oui}} || [[Manon Bril]] et Marjorie LeNoan ||
|-
|S08E26|| MDMA Kids ||{{date|05/06/2023}}|| {{Heure|1|37|33|durée=oui}} || Camille Fievez et [[Babor_Lelefan|Babor]] ||
|-
|S08E27|| J'irai Pisser dans vos Piscines ||{{date|12/06/2023}}|| {{Heure|1|28|37|durée=oui}} || [[Fanny Ruwet]] et Antoine Piombino ||
|-
|S08E28|| Mauvais Dégluteur ||{{date|20/06/2023}}|| {{Heure|1|27|35|durée=oui}} || PiJaMa et Léopold Lemarchand ||
|-
|S08E29|| Le Triple Tacos de la Comédie ||{{date|26/06/2023}}|| {{Heure|2|33|19|durée=oui}} || Team Calmos (David Honnorat et Hugo Alexandre) ||
|-
|S08E30|| C'est Pas à Moi de le Dire ||{{date|03/07/2023}}|| {{Heure|1|20|59|durée=oui}} || [[Jean-Pascal Zadi]] et [[Sophie-Marie Larrouy]] ||
|-
|S08E31|| Nom de Chien Basique ||{{date|10/07/2023}}|| {{Heure|1|46|56|durée=oui}} || [[Sébastien Chassagne]] et [[Justine Le Pottier]] ||
|-
| colspan="6" bgcolor="#A3C3E3" style="text-align:center;" | '''Saison 9'''
|-
|S09E01|| Javascript.Deux ||{{date|18/09/2023}}|| {{Heure|1|36|23|durée=oui}} || Théo Juice et [[Mister V]] ||
|-
|S09E02|| Lou Bedia ||{{date|25/09/2023}}|| {{Heure|1|31|41|durée=oui}} || [[Melha Bedia]] et [[Alison Wheeler]] ||
|-
|S09E03|| Druide Marmaï ||{{date|02/10/2023}}|| {{Heure||55|14|durée=oui}} || [[Pio Marmaï]] et [[Olivier Nakache]] ||
|-
|S09E04|| Pas du Tout Encore une Fois ||{{date|09/10/2023}}|| {{Heure|1|45|18|durée=oui}} || Urbain et [[Morgane Cadignan]] ||
|-
|S09E05|| Le Rocancourt de Continent ||{{date|22/10/2023}}|| {{Heure|1|27|06|durée=oui}} || Cécile Marx et Teddy Férent || Club Célest, Le Précepteur (podcast), Le Pianiste aux 50 doigts, Neurosciences : les méandres du cerveau (YouTube), [[Le Règne animal]], [[Mon homme (film, 1996)]]
|-
|S09E06|| Cigoland Royal ||{{date|30/10/2023}}|| {{Heure|1|58|12|durée=oui}} || [[Doully]] et [[Baptiste Lecaplain]] || Importantissime (de Chris Esquerre), Mosa Lina, [[Melan Omerta]] (rappeur), [[Furax (rappeur)]], Ben Junior (rappeur)
|-
|S09E07|| Pas si Mal ||{{date|06/11/2023}}|| {{Heure|1|34|13|durée=oui}} || Gaël Mectoob et [[Natoo]] ||
|-
|S09E08|| Jean-Luc Pikachu ||{{date|13/11/2023}}|| {{Heure|1|39|33|durée=oui}} || [[Léna Situations]] et [[Bigflo]] ||
|-
|S09E09|| Inspecteur Gotainer ||{{date|20/11/2023}}|| {{Heure|1|29|29|durée=oui}} || [[Vincent Dedienne]] et [[Géraldine Nakache]] ||
|-
|S09E10|| Chacun son LeBihan ||{{date|27/11/2023}}|| {{Heure|1|51|33|durée=oui}} || [[Neefa]] et [[Mehdi Maïzi]] || La chaîne Youtube ''Calmos'' (notamment la vidéo sur [[Robert De Niro]]), ''Dernier Relais'' de [[Benjamin Tranié]], Le jeu ''[[Baba Is You]]'', L'application mobile ''Padloc'', L’artiste musicien Jalen N'Gonda, La Chaîne Youtube ''Blow Up''
|-
|S09E11|| Levons nos mères ||{{date|04/12/2023}}|| {{Heure|1|24|22|durée=oui}} || [[Rosa Bursztein]] et [[Justine Le Pottier]] || ''[[Mars Express (film)|Mars Express]]'', Le podcast ''Sur Parole'' de Guiguipop, ''[[The Crown (série télévisée)|The Crown]]'', ''[[Festen]]''
|-
|S09E12|| Boa Constructeur ||{{date|11/12/2023}}|| {{Heure|1|18|55|durée=oui}} || [[Eric Judor]] et [[Arthur Sanigou]] || ''Ready For War'' de ''[[Benjamin Epps]]'', ''DAVA 9'' d{{'}}[[Augustin Shackelpopoulos]] et de [[''Sacha Béhar|Sacha Behar'']], ''KASSESSA'' d'[[Ichon (rappeur)|Ichon]], et l'album éponyme d'[[Aliocha Schneider]]
|-
|S09E13|| La forme Jérem ||{{date|18/12/2023}}|| {{Heure|1|42|05|durée=oui}} || [[Sofia Lesaffre]], [[Sébastien Vaniček]] et [[Jérôme Niel]] ||
|-
|S09E14|| La Quoicoumaladie d'Amour ||{{date|25/12/2023}}|| {{Heure|1|45|49|durée=oui}} || [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
|S09E15|| Floodcast Crypte || {{date|15/01/2024}}|| {{Heure|1|29|06|durée=oui}} || ||
|-
|S09E16|| Tatouage Derrière l'Oreille ||{{date|22/01/2024}}|| {{Heure|1|43|48|durée=oui}} || [[Laurie Peret]] et [[Benjamin Tranié]] || ''[[Jusant (jeu vidéo)|Jusant]]'', ''[[Sideways]]'', ''[[TTMC 2 - TU TE REMETS COMBIEN ?]]'', ''[[D'argent et de sang]]'', ''[[Starmania]]'', ''[[Le Talentueux Mr Ripley]]'', ''[[Orgueil et Préjugés (film, 2005)|Orgueil et Préjugés]]'', ''Sans issue, la tuerie de Chevaline'', ''[[Past Lives (film)|Past Lives]]''
|-
|S09E17|| Bingolasko ||{{date|30/01/2024}}|| {{Heure|1|28|26|durée=oui}} || [[Justine Le Pottier]] et [[Valentin Vincent]] ||
|-
|S09E18|| Jonathan Cocktail ||{{date|05/02/2024}}|| {{Heure|1|30|39|durée=oui}} || [[Jonathan Cohen]] ||
|-
|S09E19|| La Bosse à Patoche ||{{date|12/02/2024}}|| {{Heure|1|35|16|durée=oui}} || [[Marie de Brauer]] et [[Lisa Villaret]] ||
|-
|S09E20|| Quasi-Hebdo d'El Paris ||{{date|19/02/2024}}|| {{Heure|1|18|39|durée=oui}} || Jason Brokerss et [[Sophie-Marie Larrouy]] ||
|-
|S09E21|| Squid Boyard ||{{date|26/02/2024}}|| {{Heure|1|43|04|durée=oui}} || [[Bérengère Krief]] et [[Jérémy Ferrari]] ||
|-
|S09E22|| Coq Versatile ||{{date|04/03/2024}}|| {{Heure|1|17|26|durée=oui}} || [[William Lebghil]] et [[Sébastien Chassagne]] ||
|-
|S09E24|| Personne n'a Envie de Prendre sa Place ||{{date|18/03/2024}}|| {{Heure|1|38|30|durée=oui}} || Pauline de Tarragon (PiJaMa) et Camille Fievez ||
|-
|S09E25|| Adri Debunk ''(en live du Pathé Bellecour à Lyon)'' ||{{date|25/03/2024}}|| {{Heure||57|01|durée=oui}} || [[Jérôme Niel]] ||
|-
|S09E26|| RobioCoop ||{{date|01/04/2024}}|| {{Heure|1|28|48|durée=oui}}|| [[Fadily Camara]] et [[Pierre Lapin (streamer)|Pierre Lapin]] ||
|-
|S09E27|| Le Kangourou du Cinéma Français ||{{date|08/04/2024}}|| {{Heure|1|14|45|durée=oui}} || [[Charlotte Gainsbourg]] et [[José Garcia]] ||
|-
|S09E28|| LinoxTag ''(en live du CGR Le Français à Bordeaux)'' ||{{date|15/04/2024}}|| {{Heure||53|24|durée=oui}} || [[Benjamin Tranié]] || La BD ''RIP'' de [[Gaët's]], ''[[Marvel Snap]]''
|-
|S09E29||André Menielle et Pascal l'Acteur ||{{date|22/04/2024}}|| {{Heure|1|07|30|durée=oui}}|||| ''Qui c'est qui fera la meilleure chanson paillarde'' de [[Mister V]], Le film ''[[Vampire humaniste cherche suicidaire consentant]]'', le podcast ''Soluce''      
|-
|S09E30||Le Trou de l'Agrafeuse||{{date|29/04/2024}}|| {{Heure|1|48|38|durée=oui}} ||[[Pierre Niney]] et [[Géraldine Nakache]]||
|-
|S09E31||Pépom les Nappes||{{date|06/05/2024}}|| {{Heure|1|38|56|durée=oui}} ||[[David Castello-Lopes]] et [[Morgane Cadignan]]||
|-
|S09E32||Trois Tonneaux dans les Champs||{{date|13/05/2024}}|| {{Heure|1|40|15|durée=oui}} ||[[Éléonore Costes]] et Nicolas Berno||
|-
|S09E33||Les Auditeurs du Floodcast||{{date|20/05/2024}}|| {{Heure|1|22|09|durée=oui}} || ||
|-
|S09E34||Roselyne Bachelor||{{date|10/06/2024}}|| {{Heure|1|50|31|durée=oui}} ||[[Nathalie Odzierejko]] et [[Vanessa Brias]]||
|-
|S09E35||Adrien Ronchon ||{{date|17/06/2024}}|| {{Heure|1|34|29|durée=oui}} ||[[Laura Felpin]] et [[Cédric Salaun]]||
|-
|S09E36|| Tartinade Vegan||{{date|24/06/2024}}|| {{Heure|1|48|07|durée=oui}} ||Urbain||
|-
|S09E37||Achète un Ukulele||{{date|01/07/2024}}|| {{Heure|1|37|06|durée=oui}} ||[[Aymeric Lompret]] et [[Doully]]||
|-
|S09E38||Amel Bègue||{{date|08/07/2024}}|| {{Heure|1|47|56|durée=oui}} ||[[Kalindi Ramphul]] et [[Camille Lorente]]||
|-
|S09E39||Laurent les Feats||{{date|15/07/2024}}|| {{Heure|1|39|32|durée=oui}} ||[[Benjamin Tranié]] et [[Zaid Sahebdin]]||
|-
| colspan="6" bgcolor="#EEB530" style="text-align:center;" | '''Saison 10'''
|-
|S10E01|| Trois Cafards gourmands ||{{date|16/09/2024}}|| {{Heure|1|41|14|durée=oui}} || [[Morgane Cadignan]] et [[Jérôme Niel]] ||
|-
|S10E02|| Jamais le Lendemain ||{{date|23/09/2024}}|| {{Heure|1|28|00|durée=oui}} || [[Shirine Boutella]] et [[Melha Bedia]] || ''[[Super Bunny Man]]'', ''[[Présumé innocent (série télévisée)|Présumé innocent]]'', ''[[La nuit se traîne]]'', ''[[Hit Man (film, 2023)|Hit Man]]''
|-
|S10E03|| True de Balle Detective ||{{date|30/09/2024}}|| {{Heure|1|42|40|durée=oui}} || [[Marie de Brauer]] et [[Axel Maliverney]] ||
|-
|S10E04|| Un Eléphant en Pyjama ||{{date|07/10/2024}}|| {{Heure|1|57|26|durée=oui}} || [[Jean-Baptiste Toussaint]] et [[Mehdi Benchebana]] ||
|-
|S10E05|| Folkloriste Professionnel ||{{date|14/10/2024}}|| {{Heure|1|49|43|durée=oui}} || [[Manon Bril]] et [[Patrick Baud]] ||
|-
|S10E06|| Le Hamac de John ||{{date|21/10/2024}}|| {{Heure|1|34|13|durée=oui}} || [[Alban Ivanov]] et [[Audrey Pirault]] ||
|-
|S10E07|| ¡ Ay, Dracula ! ||{{date|28/10/2024}}|| {{Heure|1|43|56|durée=oui}} || [[Nathalie Odzierejko]] et [[Sébastien Vaniček]] ||
|-
|S10E08|| FlopCast ||{{date|4/11/2024}}|| {{Heure|1|30|52|durée=oui}} || [[Maxime Biaggi]] et [[Grimkujow]] ||
|-
|S10E09|| Epiler une Souris ||{{date|11/11/2024}}|| {{Heure|1|18|28|durée=oui}} || [[Ana Godefroy]] et [[Fanny Ruwet]] ||
|-
|S10E11|| Gazo de Sagazan ||{{date|25/11/2024}}|| {{Heure|1|48|43|durée=oui}} || Yoa et Maxence ||
|-
|S10E12|| Le Bernard Mabille du Rap ||{{date|02/12/2024}}|| {{Heure||55|06|durée=oui}} || [[Noémie Merlant]] et [[Louis Garrel]] || Podcast ''Mouse Cast'' (Adrien), Exposition ''L'intime, de la chambre aux réseaux sociaux'' au [[Musée des Arts décoratifs (Paris)]] (Noémie), Film ''Le Royaume'' de Julien Colonna (Louis)
|-
|S10E13|| ClaRatatouille ||{{date|09/12/2024}}|| {{Heure|1|16|18|durée=oui}} || [[Clara Luciani]] et [[Laura Felpin]] ||
|-
|S10E14|| Détournons l'Oignon ||{{date|16/12/2024}}|| {{Heure|1|31|55|durée=oui}} || [[Jérôme Commandeur]] et [[Benjamin Tranié]] ||
|-
|S10E15|| Y'a Plus de Gant ||{{date|23/12/2024}}|| {{Heure|1|33|50|durée=oui}} || [[Géraldine Nakache]] et [[Vincent Dedienne]] ||
|-
|S10E16|| Sassy Mitterand ||{{date|30/12/2024}}|| {{Heure|1|39|59|durée=oui}} || Louise et Chloé de ''Hot Girls Only'' ||
|-
|S10E17|| La Lumière sur Pascal Sevran ||{{date|20/01/2025}}|| {{Heure|2|00|12|durée=oui}}|| Pierre Lapin ||
|-
|S10E18|| What About Mini-Golf ? ||{{date|27/01/2025}}|| {{Heure|1|45|27|durée=oui}} || [[Pauline de Tarragon|PiJaMa]] et [[Sylvqin]] ||
|-
|S10E19|| Gaule de Crocodile ||{{date|03/02/2025}}|| {{Heure|1|30|41|durée=oui}} || [[Justine Le Pottier]] et Urbain ||
|-
|S10E20|| Tapisse la Lunette ||{{Date|10/02/2025}}|| {{Heure|1|36|45|durée=oui}} || Fanny « LaPanny » et Léopold Lemarchand ||
|-
|S10E21|| Détournement de Saucisses ||{{Date|17/02/2025}}|| {{Heure|1|08|17|durée=oui}} || [[Vimala Pons]] et [[Pio Marmaï]] ||
|-
|S10E22|| Burger Juteux ||{{Date|24/02/2025}}|| {{Heure|1|34|48|durée=oui}} || [[Tiphaine Daviot]] et [[Julien Pestel]] ||
|-
|S10E23|| Rien à Voir avec Boomer ||{{Date|03/03/2025}}|| {{Heure|1|38|43|durée=oui}} || [[Kyan Khojandi]] et [[Bruno Muschio]] ||
|-
| S10E24|| Le Jésus de la Chips ||{{Date|10/03/2025}}|| {{Heure|1|40|45|durée=oui}} || [[Enya Baroux]] et Anis Rhali ||
|-
| S10E25|| Oiseau en V ||{{Date|17/03/2025}}|| {{Heure|1|40|49|durée=oui}} || Marie de Brauer et Lucien Maine ||
|-
| S10E26 || Lorenzo Washington ||{{Date|24/03/2025}}|| {{Heure|1|30|45|durée=oui}} || Aucun ||
|-
| S10E27 || Téléphone Débile ||{{Date|31/03/2025}}|| {{Heure|1|28|41|durée=oui}} || [[Chloé Jouannet]] et [[Panayotis Pascot]] || ''[[Adolescence (série télévisée)|Adolescence]]'', ''[[Panayotis Pascot|La prochaine fois que tu mordras la poussière]]'', Alphi (vidéaste)
|-
| S10E28 || Victor Lanoux Prime ||{{Date|07/04/2025}}|| {{Heure|2|01|34|durée=oui}} || [[Mehdi Maïzi]] et Ngiraan Fall ||
|-
| S10E29 || Addict au Confort ||{{Date|14/04/2025}}|| {{Heure|1|55|38|durée=oui}} || [[Merwane Benlazar]] et Tunis Hilton ||
|-
| S10E30 || La Sismance ||{{Date|21/04/2025}}|| {{Heure|1|55|38|durée=oui}} || Morgane Cadignan et Fanny Ruwet ||
|-
| S10E31 || FC Taxi 2 ||{{Date|27/04/2025}}|| {{Heure|1|55|38|durée=oui}} || Mourad Winter et Benjamin Tranié ||
|-
| Spécial || Il s'agissait du Floodcast ||{{Date|30/04/2025}}|| {{Heure||20|13|durée=oui}} || - ||
|-
| S10E32 || Les années Golden Moustache ||{{Date|05/05/2025}}|| {{Heure|2|34|32|durée=oui}} || Vladimir Rodionov et [[Justine Le Pottier]] ||
|-
| S10E33 || Fossile de Shirley et Dino ||{{Date|12/05/2025}}|| {{Heure|1|40|37|durée=oui}} || Camille Fievez et Babor ||
|-
| S10E34 || Fabien Au Lit Tard ||{{Date|19/05/2025}} || {{Heure|1|41|47|durée=oui}} || Adel Fugazi et [[Pierre Thevenoux]] ||
|-
| S10E35 || Farfelue de Terrain ||{{Date|26/05/2025}} || {{Heure|1|01|59|durée=oui}} || Pauline de Tarragon et Ana Godefroy ||
|-
| S10E36 || Le Cosy Floodcast ||{{Date|02/06/2025}} || {{Heure|2|12|51|durée=oui}} || Medoc et Moguri (''Cosy Corner'') ||
|-
| S10E37 || La Pouproule ||{{Date|09/06/2025}} || {{Heure|1|43|03|durée=oui}} || [[Alison Wheeler]] et [[Baptiste Lecaplain]] || ''[[Vrais voisins, faux amis]]'' (Lecaplain), ''[[Partir un jour (film)|Partir un jour]]'' (Wheeler), ''Alice Underground'' (Ménielle), le spectacle de Léopold Lemarchand et ''Post Mortem'' de Sarah Silverman (Bernard)
|-
| S10E38 || Bonnes blagues d'IA ||{{Date|16/06/2025}} || {{Heure|1|39|28|durée=oui}} || [[Bilal Hassani]] et [[Alice Moitié]] ||
|-
| S10E39 || C'était un Rêve à Réaliser ||{{Date|23/06/2025}} || {{Heure|1|02|02|durée=oui}} || [[Morgane Cadignan]], [[Benjamin Tranié]] et [[Mister MV]] || Enregistré à la salle Pleyel le 19 juin 2025.
|-
| S10E40 || Le Cri du Jugnot ||{{Date|30/06/2025}} || {{Heure|1|11|33|durée=oui}} || [[Gérard Jugnot]] et [[Maxime Gasteuil]] ||
|-
| S10E41 || Elon Meusp ||{{Date|06/07/2025}} || {{Heure|1|15|32|durée=oui}} || [[Natoo]], [[Mister V]] et [[Wankil Studio|Terracid]] || Enregistré à la salle Pleyel le 20 juin 2025. Invité spécial : [[Franck Dubosc]]
|-
| S10E42 || Au revoir le Floodcast ||{{Date|13/07/2025}} || {{Heure|1|30|45|durée=oui}} || [[Géraldine Nakache]], [[Vincent Dedienne]], [[Pierre Niney]], [[Benjamin Tranié]], Maxence, [[Clara Luciani]], [[Orelsan]], [[Pio Marmaï]] || Enregistré à la salle Pleyel le 21 juin 2025.
|-
| S10E43 || Pierre Bachelet Sature ||{{Date|06/07/2025}} || {{Heure|1|29|57|durée=oui}} || — || —
|}
{{Boîte déroulante/fin}}`;

describe('getWikipediaInfo', () => {
	it('should return 247 episodes', () => {
		expect(Object.keys(getWikipediaInfo(wikipediaInfo))).toHaveLength(247);
	});

	it('should normalize all infos', () => {
		expect(getWikipediaInfo(wikipediaInfo)).toMatchSnapshot();
	});
});

describe('normalizeInfos', () => {
	describe('empty', () => {
		it('should return empty array if contains "-"', () => {
			expect(normalizeInfos('-')).toEqual([]);
		});

		it('should return empty array if contains "—"', () => {
			expect(normalizeInfos('—')).toEqual([]);
		});

		it('should return empty array if contains " - "', () => {
			expect(normalizeInfos(' - ')).toEqual([]);
		});

		it('should return empty array if contains "Aucun"', () => {
			expect(normalizeInfos('Aucun')).toEqual([]);
		});
	});

	describe('single', () => {
		it('should remove italic', () => {
			expect(normalizeInfos("''Kiwami Japan''")).toEqual(['Kiwami Japan']);
		});

		it('should remove nobr parsing', () => {
			expect(
				normalizeInfos('Greg du podcast {{nobr|2 heures}} de perdues'),
			).toEqual(['Greg du podcast 2 heures de perdues']);
		});

		it('should remove "Avec la participation de "', () => {
			expect(normalizeInfos('Avec la participation de BigFlo')).toEqual([
				'BigFlo',
			]);
		});

		it('should remove "Lucas Pastor dans le rôle du Maire Geek"', () => {
			expect(normalizeInfos('Lucas Pastor dans le rôle du Maire Geek')).toEqual(
				['Lucas Pastor'],
			);
		});

		it('should consider "Ina Mihalache, dit Solange te Parle" as 1 guest only', () => {
			expect(normalizeInfos('Ina Mihalache, dit Solange te Parle')).toEqual([
				'Ina Mihalache (Solange te Parle)',
			]);
		});

		it('should remove link', () => {
			expect(normalizeInfos('[[Éléonore Costes]]')).toEqual([
				'Éléonore Costes',
			]);
		});

		it('should keep link display name', () => {
			expect(normalizeInfos('[[Mcfly et Carlito|Mcfly]]')).toEqual(['Mcfly']);
		});
	});

	describe('multiple', () => {
		it('should return multiple infos', () => {
			expect(normalizeInfos('[[Mcfly et Carlito]]')).toEqual([
				'Mcfly',
				'Carlito',
			]);
		});

		it('should remove all links', () => {
			expect(
				normalizeInfos(
					'[[Mcfly et Carlito|Mcfly]], [[Taous Merakchi|Jack Parker]] et [[François Descraques]]',
				),
			).toEqual(['Mcfly', 'Jack Parker', 'François Descraques']);
		});

		it('should consider "Team Calmos (David Honnorat et Hugo Alexandre)" as 2 guests', () => {
			expect(
				normalizeInfos('Team Calmos (David Honnorat et Hugo Alexandre)'),
			).toEqual([
				'David Honnorat (Team Calmos)',
				'Hugo Alexandre (Team Calmos)',
			]);
		});

		it('should rename "Medoc et Moguri (Cosy Corner)"', () => {
			expect(normalizeInfos('Medoc et Moguri (Cosy Corner)')).toEqual([
				'Medoc (Cosy Corner)',
				'Moguri (Cosy Corner)',
			]);
		});
	});
});
