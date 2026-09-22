const teams = [
  {
    "code": "SJO",
    "id": "sjo",
    "name": "San José FC",
    "officialName": "SAN JOSE FC",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "San Jose  de la Montaña",
    "p": 4,
    "gd": 10,
    "pts": 12,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png"
  },
  {
    "code": "JVS",
    "id": "jvs",
    "name": "Juventus",
    "officialName": "JUVENTUS",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Fraccionamiento",
    "p": 4,
    "gd": 14,
    "pts": 9,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png"
  },
  {
    "code": "HER",
    "id": "her",
    "name": "Hermanos",
    "officialName": "HERMANOS",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Campo 1 (Empastado)",
    "p": 3,
    "gd": 4,
    "pts": 7,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png"
  },
  {
    "code": "LIN",
    "id": "lin",
    "name": "Linces",
    "officialName": "LINCES",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Fraccionamiento",
    "p": 3,
    "gd": 3,
    "pts": 6,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png"
  },
  {
    "code": "NAP",
    "id": "nap",
    "name": "Napoli",
    "officialName": "NAPOLI",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Campo 2",
    "p": 4,
    "gd": 1,
    "pts": 6,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png"
  },
  {
    "code": "FRA",
    "id": "fra",
    "name": "Franco FC",
    "officialName": "FRANCO FC",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Romerillo",
    "p": 3,
    "gd": 0,
    "pts": 6,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png"
  },
  {
    "code": "HFC",
    "id": "hfc",
    "name": "Herreras FC",
    "officialName": "HERRERAS FC",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Campo 1 (Empastado)",
    "p": 4,
    "gd": -3,
    "pts": 4,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/herreras-fc.png"
  },
  {
    "code": "ABE",
    "id": "abe",
    "name": "Abejas",
    "officialName": "ABEJAS",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Pozos",
    "p": 4,
    "gd": 0,
    "pts": 3,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/abejas.png"
  },
  {
    "code": "LOB",
    "id": "lob",
    "name": "Lobos CDG",
    "officialName": "LOBOS CDG",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Campo 1 (Empastado)",
    "p": 4,
    "gd": -15,
    "pts": 3,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/lobos-cdg.png"
  },
  {
    "code": "TER",
    "id": "ter",
    "name": "Terricolas",
    "officialName": "TERRICOLAS",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Campo 2",
    "p": 3,
    "gd": -10,
    "pts": 0,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/terricolas.png"
  },
  {
    "code": "GAC",
    "id": "gac",
    "name": "Galacticos",
    "officialName": "GALACTICOS",
    "category": "Primera Fuerza",
    "coach": "No publicado",
    "field": "Pozos",
    "p": 4,
    "gd": -4,
    "pts": -12,
    "form": [],
    "founded": null,
    "news": "Datos oficiales sincronizados con AdminFut",
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/teams/galacticos-pozos.webp"
  }
];
const HOME_OFFICIAL_STANDINGS=[
  {
    "name": "San José FC",
    "officialName": "SAN JOSE FC",
    "p": 4,
    "gd": 10,
    "pts": 12,
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png"
  },
  {
    "name": "Juventus",
    "officialName": "JUVENTUS",
    "p": 4,
    "gd": 14,
    "pts": 9,
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png"
  },
  {
    "name": "Hermanos",
    "officialName": "HERMANOS",
    "p": 3,
    "gd": 4,
    "pts": 7,
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png"
  },
  {
    "name": "Linces",
    "officialName": "LINCES",
    "p": 3,
    "gd": 3,
    "pts": 6,
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png"
  },
  {
    "name": "Napoli",
    "officialName": "NAPOLI",
    "p": 4,
    "gd": 1,
    "pts": 6,
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/napoli.png"
  },
  {
    "name": "Franco FC",
    "officialName": "FRANCO FC",
    "p": 3,
    "gd": 0,
    "pts": 6,
    "logo": "https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/franco-fc.png"
  }
];
const players = [
  {
    "id": "op1",
    "name": "Michell Ivan Rendon Rivera",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op2",
    "name": "Juan Diego Ramirez Rivera",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op3",
    "name": "Nestor Cano Acosta",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op4",
    "name": "Edgar Franco Gonzalez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op5",
    "name": "Jese Jason Jabne Sosa Salmeron",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op6",
    "name": "Pedro Navarrete Soledad",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op7",
    "name": "Cristian Moreno Coyote",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op8",
    "name": "Jesus Humberto Cabello Cazares",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op9",
    "name": "Efrain Arturo Mosqueda Razo",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op10",
    "name": "Luis Antonio Mancera Garcia",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op11",
    "name": "Braulio Franco Sanchez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op12",
    "name": "Idelfonso Espitia Ruiz",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op13",
    "name": "Juan Jesus Beltran Garcia",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op14",
    "name": "David Adan Ramirez Lopez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op15",
    "name": "Tomas Genaro Ruiz Ramos",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op16",
    "name": "Emiliano Gamez Ramirez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op17",
    "name": "Rolando Rocha Sierra",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op18",
    "name": "Jose Luis Mancera Ramirez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op19",
    "name": "Ivan Alejandro Leon Solis",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op20",
    "name": "Juan Pablo Mancera Garcia",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op21",
    "name": "Luis David Servin Escalante",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op22",
    "name": "Marcos Mendoza Mora",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op23",
    "name": "Edgar Franco Beltran",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op24",
    "name": "Juan Escalante Velasquez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op25",
    "name": "Antonio Yair Herrera Gonzalez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op26",
    "name": "Jose Gabriel Cadena Mendoza",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op27",
    "name": "Juan Antonio Olivares Peru",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op28",
    "name": "Christopher Campos Torres",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op29",
    "name": "JUAN IRAN JUAREZ CAÑADA",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op30",
    "name": "Christopher Arturo Gamez Ramirez",
    "team": "FRA",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op31",
    "name": "LUIS ENRIQUE GARCIA CONEJO",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op32",
    "name": "SERGIO ALBERTO MARTINEZ CERRITO",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op33",
    "name": "ANGEL ABRAHAM FLORES CONTRERAS",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op34",
    "name": "MOISES GUADALUPE VASQUEZ",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op35",
    "name": "ERICK OMAR DELGADO RAZO",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op36",
    "name": "JOSE ANTONIO RAMIREZ CERRITO",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op37",
    "name": "Jorge Luis Rodriguez Bahena",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op38",
    "name": "Juan Jesus Torres Garcia",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op39",
    "name": "Jose Andres Garza Calleja",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op40",
    "name": "Jose Antonio Aguilar Cano",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op41",
    "name": "Erick Lopez Ramirez",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op42",
    "name": "Harol Lenier Romana Mosqueda",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op43",
    "name": "Jonatan Gabriel Maidana",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op44",
    "name": "Edgar Eduardo Garcia Castro",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op45",
    "name": "Alejandro Moreno Banda",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op46",
    "name": "Victor Hugo Perez Ramirez",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op47",
    "name": "JOSE GUADALUPE GARCIA CONEJO",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op48",
    "name": "Efren Guadalupe Cervantes Rodriguez",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op49",
    "name": "Gael Gerardo Ambriz Mendoza",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op50",
    "name": "JESUS GERARDO RODRIGUEZ ALEJOS",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op51",
    "name": "CARLOS MAURICIO ARROYO MONTES",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op52",
    "name": "Abraham Guadalupe Valencia Flores",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op53",
    "name": "Emiliano Moreno Banda",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op54",
    "name": "Jesus Humberto Moreno Banda",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op55",
    "name": "AXEL IRAHI CHAVEZ SANCHEZ",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op56",
    "name": "CRISTIAN IVAN VARGAS RODRIGUEZ",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op57",
    "name": "Jesus Ernesto Negrete Aguilar",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op58",
    "name": "Jose de Jesus Valenzuela Aboytes",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op59",
    "name": "Mario Razo Miranda",
    "team": "HER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op60",
    "name": "Armando Conteras Pizano",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op61",
    "name": "Emanuel Rodriguez Lera",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op62",
    "name": "Jacob Grangeno Velasquez",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op63",
    "name": "Oscar Fernando Olvera Becerril",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op64",
    "name": "Carlos Javier Zuñiga Solache",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op65",
    "name": "Noe Fabian Pineda Mendoza",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op66",
    "name": "Juan Angel Gonzalez Martinez",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op67",
    "name": "Aaron Grangeno Segura",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op68",
    "name": "Jose Jair Montoya Moreno",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op69",
    "name": "Juan Pablo Muñoz Guerrero",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op70",
    "name": "Luis Daniel Gutierrez Franco",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op71",
    "name": "Edgar Jesus Zuñiga Gonzalez",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op72",
    "name": "Jose Antonio Ramos Garcia",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op73",
    "name": "Gerardo Zuñiga Vega",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op74",
    "name": "Felipe de Jesus Torres Montesino",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op75",
    "name": "Andres Criollos Chimes",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op76",
    "name": "Angel Eduardo Badillo Garcia",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op77",
    "name": "Brian Lopez Mejia",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op78",
    "name": "Juan Diego Grangeno Muñoz",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op79",
    "name": "Alejandro Alarcon Aguirre",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op80",
    "name": "Jesus Yovanny Pineda Mendoza",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op81",
    "name": "Juan Pablo Mendoza Macias",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op82",
    "name": "Miguel Angel Aguado Silva",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op83",
    "name": "Pablo Cesar Reynoso Chabolla",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op84",
    "name": "Hector Cecilio Estrada Rodriguez",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op85",
    "name": "Juan Jose Pineda Mendoza",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op86",
    "name": "Jesus Enrique Martinez Olivares",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op87",
    "name": "Juan Esteban Montecillo Solache",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op88",
    "name": "Job Benjamin Lopez Mosqueda",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op89",
    "name": "FRANCISCO JESUS AGUIRRE CANO",
    "team": "NAP",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op90",
    "name": "FRANCISCO JAVIER HERRERA PIZANO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op91",
    "name": "HUGO ENRIQUE RAMIREZ PATINO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op92",
    "name": "BRIAN VALDES GUERRERO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op93",
    "name": "ROBERTO ARGUELLO ZAVALA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op94",
    "name": "ABRAHAM ISAI RIESTRA PARRA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op95",
    "name": "JESUS ADRIAN TORRE MOSQUEDA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op96",
    "name": "DUVIER DIAZ BALANTA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op97",
    "name": "ELEUTERIO JIMENEZ CONTRERAS",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op98",
    "name": "JUAN FERNANDO ARAIZA PACHECO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op99",
    "name": "JUAN DAVID PEREZ GUTIERRZ",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op100",
    "name": "ROBERTO CARLOS DOMPABLO GONZALEZ",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op101",
    "name": "JOSE MARIA FIGUEROA NAMBO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op102",
    "name": "JUAN ANTONIO RODRIGUEZ ALCANTARA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op103",
    "name": "FRANCISCO JAVIER HERRERA TIERRABLANCA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op104",
    "name": "JHONATAN DAVID GONZALEZ PINO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op105",
    "name": "ALEXIS USBALDO SILVA GARCIA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op106",
    "name": "ISSAC YAIR GARCIA MARTINEZ",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op107",
    "name": "JUAN EDUARDO ORNELAS ARAUJO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op108",
    "name": "BRANDON VALDES ARROYO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op109",
    "name": "EDGAR OMAR REYES QUINTERO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op110",
    "name": "DAVID ARANDA VALENCIA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op111",
    "name": "JOSE MARIO FIGUEROA MOLINA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op112",
    "name": "CAMILO CAÑAS VARGAS",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op113",
    "name": "OSCAR EDUARDO GALLAGA BAEZ",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op114",
    "name": "MARTIN ARCIA MARTINEZ",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op115",
    "name": "ALEJANDRO GARCIA CAMPOS",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op116",
    "name": "LUIS ALEJANDRO VALDES ARROYO",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op117",
    "name": "FABIAN ELIAS FLORES SANCHEZ",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op118",
    "name": "CARLOS EDUARDO SANTOS CABRERA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op119",
    "name": "NESTOR GUTIERREZ MENDOZA",
    "team": "HFC",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op120",
    "name": "JORGE LUIS ALMAGUER RUIZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op121",
    "name": "FRANCISCO MANUEL NUNEZ RAMIREZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op122",
    "name": "OSCAR YANEZ RAZO",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op123",
    "name": "FELIPE DE JESUS LEON PRESA",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op124",
    "name": "LEOPOLDO ONITSED SALDIVAR FLORES",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op125",
    "name": "EMILIO GONZALEZ ZERON",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op126",
    "name": "BRYAN JOSE GONZALEZ MORENO",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op127",
    "name": "MAURICIO VILLAGOMEZ MANCERA",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op128",
    "name": "ISRAEL SOLORZANO LINARES",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op129",
    "name": "GIOVANI DE JESUS NEGRETE RUIZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op130",
    "name": "MIGUEL ANGEL RAMIREZ LUNA",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op131",
    "name": "GIOVANNI LEDEZMA ORNELAS",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op132",
    "name": "JOSE ALEXIS DELGADO REYES",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op133",
    "name": "MAXIMILIANO RIVERA HERNANDEZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op134",
    "name": "ANDFRES AGUILLON TIERRABLANCA",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op135",
    "name": "ANDRE JOSUE ALVAREZ PIZANO",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op136",
    "name": "JAVIER GONZALEZ LOPEZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op137",
    "name": "ERNESTO BALTAZAR SOSA ARREDONDO",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op138",
    "name": "OMAR HERNANDEZ BARRIOS",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op139",
    "name": "MOISES GONZALEZ MADO",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op140",
    "name": "ANGES DE JESUS PIZANO TORRES",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op141",
    "name": "DIEGO ABOYTES ESPEJEL",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op142",
    "name": "LUIS ALONSO FLORES SANCHEZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op143",
    "name": "ADRIAN VALADEZ RANGEL",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op144",
    "name": "JUAN FRANCISCO YANEZ RAZO",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op145",
    "name": "ANDRES SOLORZANO NORIA",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op146",
    "name": "SALVADOR JUNIOR BENITEZ LEON",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op147",
    "name": "EMILIO TADEO ROSAS RESENDIZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op148",
    "name": "MIGUEL DE JESUS ABOYTES GONZALEZ",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op149",
    "name": "SERGIO JASSO POMPA",
    "team": "LIN",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op150",
    "name": "Javier Lara Valencia",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op151",
    "name": "Juan Manuel Gamez Lopez",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op152",
    "name": "Gustavo Guadalupe Rico Huerta",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op153",
    "name": "Silvestre Rico Sanchez",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op154",
    "name": "Obed Noria Villa",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op155",
    "name": "Edgar Cruz Cañada",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op156",
    "name": "Milton Olvera Ramirez",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op157",
    "name": "Juan Jesus Centeno Cañada",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op158",
    "name": "Roberto Centeno Cañada",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op159",
    "name": "Jesus Jaralillo Rico",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op160",
    "name": "Fernando Gamez Reyes",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op161",
    "name": "Carlos Antonio Cruz Cañada",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op162",
    "name": "Paulo Cesar peña Jaralillo",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op163",
    "name": "Cristopher Peña Jaralillo",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op164",
    "name": "David Luis Cruz Cañada",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op165",
    "name": "Juan Pablo Almanza Gamez",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op166",
    "name": "Pablo Francisco Garcia Ramirez",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op167",
    "name": "Jose Guadalupe Peña Jaralillo",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op168",
    "name": "Jose Manuel Gamez Zarate",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op169",
    "name": "Enrique Alexis Velasquez Buenavista",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op170",
    "name": "Juan Luis Noria Villa",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op171",
    "name": "Diego Giovanni Belman Lopez",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op172",
    "name": "Eric Peña Luna",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op173",
    "name": "Juan Carlos Gamez Buenavista",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op174",
    "name": "Marco Antonio Gamez Ramirez",
    "team": "ABE",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op175",
    "name": "Juan Carlos Ramirez Alberto",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op176",
    "name": "Martin Almanza Cuevas",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op177",
    "name": "David Moreno Ramirez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op178",
    "name": "Mauricio Collasco Alvarado",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op179",
    "name": "Luis Yael Robles Perez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op180",
    "name": "Diego Collasco Alvarado",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op181",
    "name": "Daniel Landin Tellez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op182",
    "name": "Emmanuel Conejo Mendoza",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op183",
    "name": "Jonathan Landin Perez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op184",
    "name": "Luis Alejandro Mendoza Dominguez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op185",
    "name": "Edgar Ulises Celio Hernandez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op186",
    "name": "Jonathan Medina Frias",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op187",
    "name": "Bryan Nuñez Medina",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op188",
    "name": "Elvis Perez Peñaloza",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op189",
    "name": "Kevin Orlando Lara Ruiz",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op190",
    "name": "Jorge Luis Garcia Garcia",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op191",
    "name": "Juan Pedro Garcia Garcia",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op192",
    "name": "Luis David Garcia Leon",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op193",
    "name": "Juan Carlos Peña Pescador",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op194",
    "name": "Emiliano Rubi Campos",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op195",
    "name": "Jose Antonio Rubi Perez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op196",
    "name": "Adrian Moreno Razo",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op197",
    "name": "Jairo Ramirez Lopez",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op198",
    "name": "Cecilio Miranda Acosta",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op199",
    "name": "Andres Gerardo Yañez Navarro",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op200",
    "name": "Miguel Angel Gomez Campos",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op201",
    "name": "Ernesto Juarez Olmos",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op202",
    "name": "Julio Cesar Villagomez Moreno",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op203",
    "name": "Mario Moreno Robles",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op204",
    "name": "Adan Oswaldo García Escalante",
    "team": "LOB",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op205",
    "name": "Justo Emmanuel Presa Guerrero",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op206",
    "name": "Salvador Fernando Valenzuela Rangel",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op207",
    "name": "Jorge Alberto Sanchez Mendoza",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op208",
    "name": "Jorge Jesus Sanchez Gonzalez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op209",
    "name": "Jose Guadalupe Moreno Huerta",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op210",
    "name": "Emmanuel Dompablo Gonzalez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op211",
    "name": "Edgar Jadir Gonzalez Manzanares",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op212",
    "name": "Eduardo Ramirez Nuñez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op213",
    "name": "Daniel Montenegro Gutierrez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op214",
    "name": "Edilberto Guerrero Butanda",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op215",
    "name": "Jairo Antonio Olguin Rocha",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op216",
    "name": "Jose Guadalupe Guerrero Lopez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op217",
    "name": "Francisco Javier Zuñiga Diaz",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op218",
    "name": "Abel Alejandro Melendez Vega",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op219",
    "name": "Jose de Jesus Moreno Rodriguez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op220",
    "name": "Ramon Hernandez Conejo",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op221",
    "name": "Omar Valadez Banda",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op222",
    "name": "Oscar Monroy Camacho",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op223",
    "name": "Juan Miguel Muñoz Vasquez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op224",
    "name": "Jorge Luis Ramirez Conejo",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op225",
    "name": "Jesus  Axel Guerrero Peña",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op226",
    "name": "Jose de Jesus Acosta Rangel",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op227",
    "name": "Manuel Pantoja Hernandez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op228",
    "name": "Juan Carlos Rico Hernandez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op229",
    "name": "Giovanni Lerma Hernandez",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op230",
    "name": "Jose Ramon Negrete Ruiz",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op231",
    "name": "Enrique Alexis Castro Rivera",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op232",
    "name": "Juan Carlos Acosta Zarate",
    "team": "JVS",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op233",
    "name": "Juan Arturo Lopez Campos",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op234",
    "name": "Hector Manuel Ramirez Tovar",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op235",
    "name": "Brayan Alexis Vargas Bravo",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op236",
    "name": "Rafael Perez Nava",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op237",
    "name": "Nestor Gabriel Toledo Damian",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op238",
    "name": "Diego Isaac Barron Gonzalez",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op239",
    "name": "Angel Santiago Garcia",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op240",
    "name": "Hector Adrian Perez Vega",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op241",
    "name": "Juan Esteban Delgado Acosta",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op242",
    "name": "Brayan Camilo Sanclemente Alvarado",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op243",
    "name": "Luis Angel Valencia Mejia",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op244",
    "name": "Jesus Felipe Yañez Rubi",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op245",
    "name": "Arturo Martinez Magdaleno",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op246",
    "name": "Luis Fernando Medina Aguirre",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op247",
    "name": "Marcos Antonio Valenzuela Sanchez",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op248",
    "name": "Zuriel Adrian Gutierrez Valdez",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op249",
    "name": "Jose Refugio Acosta Garcia",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op250",
    "name": "Jose Eduardo Bravo Sandoval",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op251",
    "name": "Jose Cruz Enrique Martinez Hernandez",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op252",
    "name": "Fernando Said Doñate Mancera",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op253",
    "name": "Aldo Alberto Martinez Diaz",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op254",
    "name": "Hector Hugo Gonzalez Diosdado",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op255",
    "name": "Jose Rosas Cardenas",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op256",
    "name": "Santiago Lerma Tovar",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op257",
    "name": "Carlos Eduardo Garcia Tavera",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op258",
    "name": "Alberto Antonio Ramirez Alfaro",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op259",
    "name": "Mario Eduardo Cardenas Ayala",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op260",
    "name": "Marco Cesar Saavedra Escoto",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op261",
    "name": "Jesus Pablo Castillo Garcia",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op262",
    "name": "HECTOR ADRIAN DE LEON GALDEANO",
    "team": "SJO",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op263",
    "name": "Pedro Gabriel Presa Guerrero",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op264",
    "name": "David Guerrero Arellano",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op265",
    "name": "Jonathan Martinez Quintanilla",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op266",
    "name": "Eduardo Martinez Vasquez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op267",
    "name": "Adrian Ruvalcaba Lerma",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op268",
    "name": "Juan Pablo Guerrero Flores",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op269",
    "name": "Leonardo Ramirez Buenavista",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op270",
    "name": "Angel Uriel Gutierrez Espinoza",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op271",
    "name": "Daniel Peña Robles",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op272",
    "name": "Rafael Martinez Lara",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op273",
    "name": "Alvaro Moreno Perez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op274",
    "name": "Lazaro Daniel Ruvalcaba Lerma",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op275",
    "name": "Erick Jose Rodriguez Cano",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op276",
    "name": "Oscar Tovar Aguilera",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op277",
    "name": "Jesus Salvador Flores Gallegos",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op278",
    "name": "Luis Fernando Aguilar Nuñez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op279",
    "name": "Jonathan Gonzalez Guerrero",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op280",
    "name": "Giovanni Lera Barbosa",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op281",
    "name": "Ivan Martinez Vasquez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op282",
    "name": "Jose Daniel Mejia Roman",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op283",
    "name": "Jose Armando Almaraz Ortega",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op284",
    "name": "Jose Daniel Martinez Chavez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op285",
    "name": "Jose Angel Gutierrez Enrique",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op286",
    "name": "Jose Antonio Moreno Vargas",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op287",
    "name": "Jose Luis Acevedo Mendoza",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op288",
    "name": "Victor Manuel Raul Muñoz Vasquez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op289",
    "name": "Christofer Ivanovich Olguin Rocha",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op290",
    "name": "Jesus Emmanuel Ojodeagua Gutierrez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  },
  {
    "id": "op291",
    "name": "Oswaldo Grande Valadez",
    "team": "TER",
    "position": "Jugador",
    "number": "",
    "goals": 0,
    "assists": 0,
    "cards": 0,
    "minutes": 0,
    "cost": 0,
    "points": 0
  }
];
const matches = [
  {
    "id": "m1",
    "day": "Mañana",
    "date": "20 sep",
    "jornada": 5,
    "category": "Primera Fuerza",
    "home": "FRA",
    "away": "HFC",
    "time": "08:00",
    "status": "SCHEDULED",
    "score": null,
    "minute": null,
    "venue": "Romerillo",
    "referee": "Por confirmar"
  },
  {
    "id": "m2",
    "day": "Mañana",
    "date": "20 sep",
    "jornada": 5,
    "category": "Primera Fuerza",
    "home": "TER",
    "away": "GAC",
    "time": "08:00",
    "status": "SCHEDULED",
    "score": null,
    "minute": null,
    "venue": "Campo por confirmar",
    "referee": "Por confirmar"
  },
  {
    "id": "m3",
    "day": "Mañana",
    "date": "20 sep",
    "jornada": 5,
    "category": "Primera Fuerza",
    "home": "LIN",
    "away": "JVS",
    "time": "08:00",
    "status": "SCHEDULED",
    "score": null,
    "minute": null,
    "venue": "Campo 3",
    "referee": "Por confirmar"
  },
  {
    "id": "m4",
    "day": "Mañana",
    "date": "20 sep",
    "jornada": 5,
    "category": "Primera Fuerza",
    "home": "HER",
    "away": "SJO",
    "time": "10:00",
    "status": "SCHEDULED",
    "score": null,
    "minute": null,
    "venue": "Campo 3",
    "referee": "Por confirmar"
  },
  {
    "id": "m5",
    "day": "Mañana",
    "date": "20 sep",
    "jornada": 5,
    "category": "Primera Fuerza",
    "home": "LOB",
    "away": "NAP",
    "time": "12:00",
    "status": "SCHEDULED",
    "score": null,
    "minute": null,
    "venue": "Cerrito de Gasca",
    "referee": "Por confirmar"
  }
];
const news = [
  {
    "id": "n1",
    "category": "Liga",
    "date": "Actualizado hoy",
    "title": "Primera Fuerza: 11 equipos registrados",
    "subtitle": "AdminFut reporta 291 jugadores registrados en la categoría.",
    "content": "Datos deportivos públicos sincronizados desde juventinorosasliga.com."
  },
  {
    "id": "n2",
    "category": "Jornada",
    "date": "20 sep 2026",
    "title": "Jornada 5 de Primera Fuerza",
    "subtitle": "Cinco partidos están programados para el 20 de septiembre.",
    "content": "Consulta horarios y sedes oficiales en Competición."
  },
  {
    "id": "n3",
    "category": "Clasificación",
    "date": "Actualizado hoy",
    "title": "San José FC encabeza la tabla",
    "subtitle": "San José FC aparece con 12 puntos tras cuatro partidos.",
    "content": "Clasificación tomada del snapshot público de AdminFut."
  },
  {
    "id": "n4",
    "category": "Datos",
    "date": "Actualizado hoy",
    "title": "Plantillas oficiales disponibles",
    "subtitle": "La app usa las plantillas públicas registradas en AdminFut.",
    "content": "Los nombres y equipos mostrados se sincronizan con la fuente deportiva pública."
  }
];
const TRANSFER_TEAM_BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
const TRANSFER_TEAMS={
  LIGA:{name:'Registro Liga',logo:'assets/liga-logo.webp'},
  FRA:{name:'Franco FC',logo:'assets/official-logos/franco-fc.png'},
  HER:{name:'Hermanos',logo:'assets/official-logos/hermanos.png'},
  NAP:{name:'Napoli',logo:'assets/official-logos/napoli.png'},
  SJO:{name:'San José FC',logo:'assets/official-logos/san-jose-fc.png'},
  SJL:{name:'San Julián',logo:'assets/official-logos/san-julian.png'},
  TVF:{name:'Tavera FC',logo:'assets/official-logos/tavera-fc.png'}
};
/* Jugadores tomados de las plantillas registradas en public/data/official-live.json.
   Los estados Confirmado/Rumor/Alta conservan la función visual del módulo de mercado. */
const transfers = [];
function transferTeam(code){return TRANSFER_TEAMS[code]||TRANSFER_TEAMS.LIGA}
function transferCrest(code){
  const t=transferTeam(code);
  return '<span class="v71-transfer-crest"><img src="'+TRANSFER_TEAM_BASE+t.logo+'" alt="'+t.name+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.parentElement.classList.add(\'fallback\');this.parentElement.setAttribute(\'data-fallback\',\''+code+'\')"></span>';
}
const seasons = [];
const defaults={theme:'dark',followed:[],favorites:[],predictions:{},fantasyPicks:{},cheers:{},notifications:{goal:true,kickoff:true,halftime:false,final:true,news:true,video:true,transfers:true,fantasy:true,predictor:true},privacy:{analytics:false,personalization:true,accepted:false},vote:null,user:null,selectedDay:'Todos',matchCategory:'Todas',searchQuery:'',transferFilter:'Todos'};
function readStore(){let parsed={};try{parsed=JSON.parse(localStorage.getItem('lj-store-v3')||'{}')}catch{}return {...defaults,...parsed,notifications:{...defaults.notifications,...(parsed.notifications||{})},privacy:{...defaults.privacy,...(parsed.privacy||{})}}}
const store=readStore();
const state={route:location.hash.replace('#/','')||'home',history:[],competitionTab:'fixtures',selectedMatch:null,selectedTeam:null,selectedPlayer:null,selectedNews:null,historyTab:'Resumen',statsTab:'General',...store};
const screen=document.querySelector('#screen');const backButton=document.querySelector('#backButton');const navItems=[...document.querySelectorAll('.nav-item')];
const icons={back:`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>`,user:`<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.6-4 4.3-6 8-6s6.4 2 8 6"/></svg>`,home:`<svg viewBox="0 0 24 24"><path d="M3 11.2 12 4l9 7.2V21h-6v-6H9v6H3z"/></svg>`,trophy:`<svg viewBox="0 0 24 24"><path d="M8 4h8v4c0 3-1.5 5-4 6-2.5-1-4-3-4-6zM8 6H4v2c0 2.2 1.3 4 3.5 4.5M16 6h4v2c0 2.2-1.3 4-3.5 4.5M12 14v4M8 21h8M9 18h6"/></svg>`,play:`<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4z"/></svg>`,shirt:`<svg viewBox="0 0 24 24"><path d="M8 4 4 6 2 10l4 2v8h12v-8l4-2-2-4-4-2c-.5 1.6-1.8 2.4-4 2.4S8.5 5.6 8 4z"/></svg>`,menu:`<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14"/></svg>`,search:`<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>`,star:`<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2L12 17.4 6.4 20.3l1.1-6.2L3 9.7l6.2-.9z"/></svg>`};
backButton.innerHTML=icons.back;document.querySelector('.profile-button').innerHTML=icons.user;document.querySelectorAll('[data-nav-icon]').forEach(el=>el.innerHTML=icons[el.dataset.navIcon]);
function save(){const data={theme:state.theme,followed:state.followed,favorites:state.favorites,predictions:state.predictions,fantasyPicks:state.fantasyPicks,cheers:state.cheers,notifications:state.notifications,privacy:state.privacy,vote:state.vote,user:state.user,selectedDay:state.selectedDay,matchCategory:state.matchCategory,transferFilter:state.transferFilter};localStorage.setItem('lj-store-v3',JSON.stringify(data))}
function toast(text){const t=document.createElement('div');t.className='toast';t.textContent=text;document.body.appendChild(t);setTimeout(()=>t.remove(),1800)}
function setTheme(theme){state.theme=theme;document.documentElement.classList.toggle('lightmode',theme==='light');save()}setTheme(state.theme);
function team(code){return teams.find(t=>t.code===code)||teams[0]}function player(id){return players.find(p=>p.id===id)}function crest(code){const t=team(code);const src=t?.logo||'';return src?`<span class="crest"><img src="${src}" alt="${t.name}" style="width:100%;height:100%;object-fit:contain;border-radius:50%" loading="lazy" decoding="async"></span>`:`<span class="crest">${code}</span>`}function formDots(list){return `<span class="form">${list.map(x=>`<b class="${x}">${x.toUpperCase()}</b>`).join('')}</span>`}function sectionHead(title,route,label='Ver todo'){return `<div class="section-head"><h2>${title}</h2>${route?`<button class="link-button" data-route="${route}">${label}</button>`:''}</div>`}function teamCell(code){const t=team(code);return `<span class="club-cell">${crest(code)}<span>${t.name}</span></span>`}function matchRow(m){const live=m.status==='LIVE'?`<span class="live">${m.minute}'</span>`:(m.score||m.time);return `<button class="match-row match-button" data-match="${m.id}"><span class="home">${team(m.home).name}</span>${crest(m.home)}<b class="score">${live}</b>${crest(m.away)}<span>${team(m.away).name}</span></button>`}function isFav(id){return state.favorites.includes(id)}function favButton(id,label='Favorito'){return `<button class="icon-action ${isFav(id)?'active':''}" data-favorite="${id}" aria-label="${label}">${icons.star}</button>`}function switchRow(key,label,sub=''){return `<label class="setting-row"><span><b>${label}</b>${sub?`<small>${sub}</small>`:''}</span><input type="checkbox" data-notification="${key}" ${state.notifications[key]?'checked':''}><i></i></label>`}function menuGroup(title,items){return `<div class="menu-group"><h3>${title}</h3>${items.map(([label,route,meta])=>`<button class="menu-row" data-route="${route}"><span>${label}${meta?`<small>${meta}</small>`:''}</span><span>›</span></button>`).join('')}</div>`}
function homeView(){
  const homeStandings=HOME_OFFICIAL_STANDINGS;
  const homeFields=(typeof V60_FIELDS!=='undefined'?V60_FIELDS:[]).slice(0,4);
  return `<div class="eyebrow">TORNEO MUNICIPAL · JORNADA 5</div>
    <h1 class="screen-title">El fútbol de<br>nuestro municipio</h1>
    <div class="stories">${[['Jornada','competition'],['Resultados','competition'],['Goleadores','scorers'],['Equipos','teams'],['Momentos','moments']].map(([n,r])=>`<button class="story" data-route="${r}"><span class="story-ring"><span class="story-inner"></span></span><small>${n}</small></button>`).join('')}</div>

    <section class="section hero">
      <span class="eyebrow" style="color:#fff">PARTIDO DE LA SEMANA</span>
      <h2>Franco FC vs<br>Herreras FC</h2>
      <p>Próximo partido oficial de Primera Fuerza.</p>
      <div class="button-row"><button class="btn primary" data-match="m1">Ver previa</button><button class="btn outline" data-action="cheer" data-cheer="m1">Apoyar · ${state.cheers.m1||0}</button></div>
    </section>

    <section class="section">${sectionHead('Momentos','moments')}
      <div class="grid-2">
        <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>Gol que encendió<br>la cancha</strong></button>
        <button class="moment" data-route="moments"><span class="badge">NUEVO</span><strong>La atajada<br>de la fecha</strong></button>
      </div>
    </section>

    <section class="section">${sectionHead('Próximos partidos','competition','Calendario')}
      <div class="card match-card"><div class="match-meta"><span class="live">EN VIVO · Jornada 5</span><span>18:00</span></div>${matchRow(matches[0])}${matchRow(matches[1])}</div>
    </section>

    <section class="section">${sectionHead('Noticias','news')}
      <div class="media-carousel">${news.slice(0,3).map(n=>`<button class="news-card" data-news="${n.id}"><span class="eyebrow">${n.category}</span><h3>${n.title}</h3><small>${n.date}</small></button>`).join('')}</div>
    </section>

    <section class="section v65-home-weather">
      <button type="button" class="v65-weather-main" data-route="weatherFields" aria-label="Abrir Clima y campos">
        <span class="v65-weather-icon">${v60Icon('weather')}</span>
        <span class="v65-weather-title">Clima y campos</span>
        <span class="v65-weather-arrow">›</span>
      </button>
      <div class="v65-weather-copy">
        <span>Consulta el clima, la sede y el estado informativo de los campos de la Liga.</span>
        <button type="button" data-route="weatherFields">Ver clima y campos</button>
      </div>
    </section>

    <section class="section v65-home-table">
      <div class="section-head"><h2>Tabla de posiciones</h2><button class="link-button" data-v63-comp="standings">Ver tabla</button></div>
      <div class="v65-table-card">
        <div class="v65-table-head"><span>#</span><span>Equipo</span><span>PJ</span><span>DG</span><span>Pts</span></div>
        ${homeStandings.map((t,i)=>`<button type="button" class="v65-table-row" data-v62-team="${t.officialName||t.name}" aria-label="Ver ${t.name}">
          <b>${i+1}</b>
          <span class="v65-table-team"><span class="v65-table-logo"><img src="${t.logo}" alt="${t.name}" loading="lazy" decoding="async"></span><strong>${t.name}</strong></span>
          <span>${t.p}</span>
          <span>${t.gd>0?'+':''}${t.gd}</span>
          <strong>${t.pts}</strong>
        </button>`).join('')}
      </div>
    </section>

    <section class="section v65-home-fields">
      <div class="section-head"><h2>Dónde se juega</h2><button class="link-button" data-route="venues">Ver todos</button></div>
      <div class="v65-field-carousel">
        ${homeFields.map((f,i)=>`<button type="button" class="v65-field-card" data-route="venues" aria-label="Ver ${f.name}">
          <span class="v65-field-visual" aria-hidden="true">${v60FieldPreview(f,'v65-field-map')}</span>
          <span class="v65-field-info"><small>${f.community}</small><b>${f.name}</b><em>${f.weather?'Clima disponible':'Ubicación disponible'}</em></span>
          <span class="v65-field-go">›</span>
        </button>`).join('')}
      </div>
    </section>`;
}
function competitionBody(){if(state.competitionTab==='standings')return `<div class="segmented"><button class="segment active">Compacta</button><button class="segment">Completa</button><button class="segment">Criterios</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>P</th><th>+/-</th><th>Pts</th><th>Forma</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td>${teamCell(t.code)}</td><td>${t.p}</td><td>${t.gd>0?'+':''}${t.gd}</td><td><b>${t.pts}</b></td><td>${formDots(t.form)}</td></tr>`).join('')}</tbody></table></div>`;if(state.competitionTab==='bracket')return `<div class="empty-state"><div class="empty-illustration"></div><h2>Cuadro no publicado</h2><p>No hay una liguilla oficial publicada en AdminFut para mostrar en este momento.</p></div>`;const filtered=matches.filter(m=>(state.selectedDay==='Todos'||m.day===state.selectedDay)&&(state.matchCategory==='Todas'||m.category===state.matchCategory));return `<div class="datebar">${['Ayer','Hoy','Mañana','Todos'].map(d=>`<button class="chip ${state.selectedDay===d?'active':''}" data-day="${d}">${d}</button>`).join('')}</div><div class="chips"><button class="chip ${state.matchCategory==='Todas'?'active':''}" data-category="Todas">Todas</button><button class="chip ${state.matchCategory==='Primera Fuerza'?'active':''}" data-category="Primera Fuerza">Primera Fuerza</button><button class="chip ${state.matchCategory==='Veteranos 35+'?'active':''}" data-category="Veteranos 35+">Veteranos 35+</button></div><h2 class="compact-title">${state.selectedDay==='Todos'?'Todos los partidos':state.selectedDay}</h2><div class="card match-card">${filtered.length?filtered.map(matchRow).join(''):`<div class="empty-mini">No hay partidos con estos filtros.</div>`}</div>`}
function competitionView(){return `<div class="eyebrow">TORNEO MUNICIPAL</div><h1 class="screen-title">Competición</h1><div class="tabs"><button class="tab ${state.competitionTab==='fixtures'?'active':''}" data-comp-tab="fixtures">Partidos y resultados<span class="v86-tab-line" aria-hidden="true"></span></button><button class="tab ${state.competitionTab==='standings'?'active':''}" data-comp-tab="standings">Clasificación</button><button class="tab ${state.competitionTab==='bracket'?'active':''}" data-comp-tab="bracket">Cuadro<span class="v86-tab-line" aria-hidden="true"></span></button></div>${competitionBody()}`}
function matchView(){const m=matches.find(x=>x.id===state.selectedMatch)||matches[0];const pred=state.predictions[m.id];return `<div class="eyebrow">${m.category} · JORNADA ${m.jornada}</div><h1 class="screen-title">${team(m.home).name}<br>vs ${team(m.away).name}</h1><div class="card match-detail"><p class="muted tiny">${m.day.toUpperCase()} · ${m.time} · ${m.venue}</p><div class="scoreboard"><div>${crest(m.home)}<b>${team(m.home).name}</b></div><strong>${m.score||'—'}</strong><div>${crest(m.away)}<b>${team(m.away).name}</b></div></div><p class="muted tiny">Árbitro: ${m.referee}</p><div class="button-row center"><button class="btn primary" data-action="cheer" data-cheer="${m.id}">Apoyar partido · ${state.cheers[m.id]||0}</button>${favButton(`match:${m.id}`,'Guardar partido')}</div></div><section class="section">${sectionHead('Tu quiniela')}<div class="card predictor-card"><div class="prediction-teams"><b>${m.home}</b><input id="predHome" type="number" min="0" max="20" value="${pred?.home??0}"><span>–</span><input id="predAway" type="number" min="0" max="20" value="${pred?.away??0}"><b>${m.away}</b></div><button class="btn primary full" data-save-prediction="${m.id}">${pred?'Actualizar pronóstico':'Guardar pronóstico'}</button>${pred?`<small class="muted">Guardado: ${pred.home}–${pred.away}</small>`:''}</div></section><section class="section">${sectionHead('Cronología')}<div class="card match-card"><div class="empty-mini">No hay cronología oficial publicada para este partido.</div></div></section>`}
function fantasyView(){return `<div class="game-hero"><span class="eyebrow">TORNEO MUNICIPAL</span><h1 class="game-title">FANTASY<br>LIGA<br>JUVENTINO</h1><p class="muted">Arma tu 7 Ideal, suma puntos y compite con tus amigos.</p><div class="button-row"><button class="btn primary" data-route="fantasyTeam">Mi 7 Ideal</button><button class="btn outline" data-route="fantasyLeagues">Ligas</button></div><div class="pitch"></div></div>`}
function fantasyTeamView(){const slots=[['POR',0],['DEF',1],['DEF',2],['MED',3],['MED',4],['DEL',5],['DEL',6]];const used=Object.values(state.fantasyPicks).map(x=>x.playerId);const total=Object.values(state.fantasyPicks).reduce((s,x)=>s+(player(x.playerId)?.points||0),0);return `<div class="eyebrow">FANTASY · JORNADA 5</div><h1 class="screen-title">Mi 7 Ideal</h1><div class="card fantasy-summary"><div><small>Puntos</small><b>${total}</b></div><div><small>Jugadores</small><b>${used.length}/7</b></div><div><small>Presupuesto</small><b>${(50-Object.values(state.fantasyPicks).reduce((s,x)=>s+(player(x.playerId)?.cost||0),0)).toFixed(1)}</b></div></div><div class="fantasy-field">${slots.map(([pos,slot])=>{const pick=state.fantasyPicks[slot];const p=pick&&player(pick.playerId);return `<button class="fantasy-slot ${p?'filled':''}" data-fantasy-slot="${slot}" data-position="${pos}">${p?`${crest(p.team)}<b>${p.name}</b><small>${p.points} pts</small>`:`<span>+</span><b>${pos}</b><small>Elegir jugador</small>`}</button>`}).join('')}</div><section class="section">${sectionHead('Jugadores disponibles')}<div class="player-list">${players.filter(p=>!used.includes(p.id)).map(p=>`<button class="player-row" data-add-player="${p.id}"><span>${crest(p.team)}<b>${p.name}</b><small>Jugador registrado</small></span><span>+</span></button>`).join('')}</div></section><button class="btn outline full" data-action="clear-fantasy">Vaciar equipo</button>`}
function teamsView(){
  /* V27_TEAMS_NATIVE_FALLBACK4 — evita mostrar el directorio genérico mientras
     el módulo V27 termina de montar el diseño anterior. */
  return `<section class="v27-teams-page v27-teams-loading" data-v27-pending="1">
    <header class="v27-teams-head">
      <button class="v27-back" type="button" data-route="more" aria-label="Volver">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>
      </button>
      <h1>Equipos</h1>
      <label class="v27-search" aria-label="Buscar equipos">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.2"/><path d="m15.2 15.2 5.1 5.1"/></svg>
        <input type="search" placeholder="Buscar equipos" disabled>
      </label>
    </header>
    <section class="v27-section"><h2>Siguiendo</h2><div class="v27-followed-row"></div></section>
    <section class="v27-section"><h2>Equipos en la competición</h2><div class="v27-grid"></div></section>
  </section>`;
}
function teamDetailView(){const t=team(state.selectedTeam||'JUV');const squad=players.filter(p=>p.team===t.code);return `<div class="team-hero">${crest(t.code)}<span><small>${t.category}</small><h1>${t.name}</h1><p>${t.field}${t.founded?` · Fundado ${t.founded}`:''}</p></span>${favButton(`team:${t.code}`)}</div><div class="button-row"><button class="btn ${state.followed.includes(t.code)?'ghost':'primary'}" data-follow="${t.code}">${state.followed.includes(t.code)?'Dejar de seguir':'Seguir equipo'}</button></div><section class="section">${sectionHead('Información')}<div class="card info-grid"><div><small>Entrenador</small><b>${t.coach}</b></div><div><small>Puntos</small><b>${t.pts}</b></div><div><small>Diferencia</small><b>${t.gd>0?'+':''}${t.gd}</b></div><div><small>Campo</small><b>${t.field}</b></div></div></section><section class="section">${sectionHead('Plantilla','players')}<div class="player-list">${squad.map(p=>`<button class="player-row" data-player="${p.id}"><span>${crest(p.team)}<b>${p.number}. ${p.name}</b><small>Jugador registrado</small></span><span>›</span></button>`).join('')}</div></section><section class="section">${sectionHead('Noticias','news')}<div class="card news-inline"><b>${t.news}</b><small>Actualizado hoy</small></div></section>`}
function playersView(){return `<div class="eyebrow">JUGADORES</div><h1 class="screen-title">Plantillas</h1><div class="searchbox"><span>${icons.search}</span><input id="playerSearch" placeholder="Buscar jugador" value="${state.searchQuery||''}"></div><div class="player-list" id="playerResults">${filterPlayers(state.searchQuery||'').map(playerRowHtml).join('')}</div>`}function filterPlayers(q){q=(q||'').toLowerCase();return players.filter(p=>p.name.toLowerCase().includes(q)||team(p.team).name.toLowerCase().includes(q)||p.position.toLowerCase().includes(q))}function playerRowHtml(p){return `<button class="player-row" data-player="${p.id}"><span>${crest(p.team)}<b>${p.name}</b><small>${team(p.team).name} · Jugador registrado</small></span><span>Registro</span></button>`}function playerDetailView(){const p=player(state.selectedPlayer)||players[0];if(!p)return '<div class="empty-mini">Jugador no disponible.</div>';return `<div class="player-hero"><div class="avatar-ball">⚽</div><span><small>${team(p.team).name} · Jugador registrado</small><h1>${p.name}</h1></span>${favButton(`player:${p.id}`)}</div><section class="section"><div class="card stat-grid"><div><b>—</b><small>Goles no publicados</small></div><div><b>—</b><small>Asistencias no publicadas</small></div><div><b>—</b><small>Minutos no publicados</small></div><div><b>—</b><small>Tarjetas no publicadas</small></div></div></section>`}
function statsView(){return `<div class="v81-stats-detail"><div class="eyebrow">DATOS</div><h1 class="screen-title">Estadísticas</h1><div class="tabs"><button class="tab active">General</button><button class="tab" data-route="leagueData">Datos oficiales</button><button class="tab" data-route="players">Jugadores</button></div><section class="section v81-stats-note"><div class="empty-mini">No se muestran asistencias, minutos ni estadísticas individuales que AdminFut no publique oficialmente.</div></section><section class="section v81-stats-summary-bottom"><div class="card stat-grid"><div><b>11</b><small>Equipos de Primera Fuerza</small></div><div><b>20</b><small>Partidos jugados</small></div><div><b>291</b><small>Jugadores registrados</small></div><div><b>—</b><small>Goleo de Primera no publicado</small></div></div></section></div>`}
const LJR_NOTICE_KEY='ljr-notice-center-v1';
function ljrReadNotices(){
  try{
    const value=JSON.parse(localStorage.getItem(LJR_NOTICE_KEY)||'[]');
    return Array.isArray(value)?value:[];
  }catch(e){return []}
}
function ljrWriteNotices(list){
  localStorage.setItem(LJR_NOTICE_KEY,JSON.stringify((list||[]).slice(0,40)));
}
function ljrNoticeText(n){
  const parts=['📣 '+String(n.title||'Aviso de la Liga')];
  if(n.category)parts.push('Categoría: '+n.category);
  if(n.matchLabel)parts.push('Partido: '+n.matchLabel);
  if(n.date||n.time)parts.push('Fecha / hora: '+[n.date,n.time].filter(Boolean).join(' · '));
  if(n.venue)parts.push('Sede: '+n.venue);
  if(n.message)parts.push(String(n.message));
  parts.push('Liga Municipal de Fútbol Juventino Rosas');
  return parts.join('\n');
}
function ljrNoticeRows(){
  const items=ljrReadNotices();
  if(!items.length)return '';
  return '<div class="ljr-notice-live-list">'+items.map(n=>
    '<article class="news-row ljr-notice-live">'+
      '<span class="news-thumb ljr-notice-thumb">📣</span>'+
      '<span class="ljr-notice-live-copy">'+
        '<small>'+v64Esc(n.type||'Aviso')+' · '+v64Esc(n.createdLabel||'Publicado desde la app')+'</small>'+
        '<b>'+v64Esc(n.title||'Aviso de la Liga')+'</b>'+
        '<p>'+v64Esc(n.message||[n.date,n.time,n.venue].filter(Boolean).join(' · '))+'</p>'+
        '<div class="ljr-notice-row-actions">'+
          '<button type="button" data-ljr-notice-share="'+v64Esc(n.id)+'">Compartir</button>'+
          '<button type="button" data-ljr-notice-copy="'+v64Esc(n.id)+'">Copiar</button>'+
          '<button type="button" data-ljr-notice-delete="'+v64Esc(n.id)+'">Eliminar</button>'+
        '</div>'+
      '</span>'+
    '</article>'
  ).join('')+'</div>';
}
function scheduleChangesView(){
  const categories=[...new Set(teams.map(t=>t.category).filter(Boolean))];
  return '<div class="eyebrow">CENTRO DE AVISOS</div>'+
    '<h1 class="screen-title">Crear y compartir aviso</h1>'+
    '<p class="muted">Genera cambios de horario, sede, suspensión o cualquier comunicado. Al guardarlo aparecerá en Avisos sin cambiar el diseño de la página.</p>'+
    '<section class="section"><div class="profile-card ljr-notice-compose">'+
      '<label><span>Tipo de aviso</span><select data-ljr-notice-type>'+
        '<option>Cambio de horario</option><option>Cambio de sede</option><option>Jornada suspendida</option><option>Aviso general</option><option>Resultado / comunicado</option>'+
      '</select></label>'+
      '<label><span>Partido opcional</span><select data-ljr-notice-match><option value="">Sin partido específico</option>'+
        matches.map(m=>'<option value="'+v64Esc(m.id)+'">'+v64Esc(team(m.home).name+' vs '+team(m.away).name+' · '+m.day+' '+m.time)+'</option>').join('')+
      '</select></label>'+
      '<label><span>Categoría</span><select data-ljr-notice-category><option value="">Todas</option>'+
        categories.map(x=>'<option>'+v64Esc(x)+'</option>').join('')+
      '</select></label>'+
      '<label><span>Título</span><input type="text" data-ljr-notice-title placeholder="Ej. Cambio de horario · Jornada 6"></label>'+
      '<div class="ljr-notice-grid">'+
        '<label><span>Fecha</span><input type="date" data-ljr-notice-date></label>'+
        '<label><span>Hora</span><input type="time" data-ljr-notice-time></label>'+
      '</div>'+
      '<label><span>Campo / sede</span><input type="text" data-ljr-notice-venue placeholder="Ej. Campo 1, Cerrito de Gasca"></label>'+
      '<label><span>Mensaje</span><textarea data-ljr-notice-message rows="4" placeholder="Escribe el comunicado que verá la gente..."></textarea></label>'+
      '<div class="button-row ljr-notice-actions">'+
        '<button class="btn primary" type="button" data-ljr-notice-publish>Guardar en Avisos</button>'+
        '<button class="btn outline" type="button" data-ljr-notice-share-draft>Compartir</button>'+
        '<button class="btn outline" type="button" data-ljr-notice-whatsapp>WhatsApp</button>'+
        '<button class="btn ghost" type="button" data-ljr-notice-copy-draft>Copiar texto</button>'+
      '</div>'+
    '</div></section>'+
    '<section class="section"><div class="settings-card">'+
      '<div class="setting-row"><span><b>Vista previa de notificación</b><small>Prueba el aviso en este teléfono cuando el navegador lo permita.</small></span><button class="btn outline" type="button" data-ljr-notice-test>Probar</button></div>'+
      '<div class="setting-row"><span><b>Envío a todos los usuarios</b><small>La interfaz queda preparada para conectarse después a Supabase + FCM/Web Push sin rediseñar esta pantalla.</small></span></div>'+
    '</div></section>';
}
function noticesView(){
  const local=ljrNoticeRows();
  return `<div class="eyebrow">AVISOS OFICIALES</div>
    <h1 class="screen-title">Avisos de la Liga</h1>
    <section class="section">
      <div class="profile-card">
        <h2>Cambios, horarios y sedes</h2>
        <p>Consulta aquí los comunicados y accesos relacionados con la jornada. Los estados oficiales de partidos se revisan en Competición.</p>
        <div class="button-row">
          <button class="btn primary" data-route="scheduleChanges">Crear aviso</button>
          <button class="btn outline" data-route="competition">Ver jornada</button>
          <button class="btn outline" data-route="venues">Ver campos</button>
        </div>
      </div>
    </section>
    <section class="section">
      ${sectionHead('Publicaciones recientes')}
      ${local}
      <div class="news-list">${news.map(n=>`<button class="news-row" data-news="${n.id}"><span class="news-thumb"></span><span><small>${n.category} · ${n.date}</small><b>${n.title}</b><p>${n.subtitle}</p></span></button>`).join('')}</div>
    </section>
    <section class="section">
      <div class="button-row">
        <button class="btn outline" data-route="v38Weekly">Lo importante de la semana</button>
        <button class="btn outline" data-route="notifications">Preferencias de avisos</button>
      </div>
    </section>`;
}
function newsView(){return `<div class="eyebrow">ACTUALIDAD</div><h1 class="screen-title">Noticias</h1><div class="chips"><button class="chip active">Todas</button><button class="chip">Liga</button><button class="chip">Equipos</button><button class="chip">Fichajes</button></div><div class="news-list">${news.map(n=>`<button class="news-row" data-news="${n.id}"><span class="news-thumb"></span><span><small>${n.category} · ${n.date}</small><b>${n.title}</b><p>${n.subtitle}</p></span></button>`).join('')}</div>`}function newsDetailView(){const n=news.find(x=>x.id===state.selectedNews)||news[0];return `<div class="eyebrow">${n.category} · ${n.date}</div><h1 class="screen-title">${n.title}</h1><div class="news-feature"></div><p class="article-lead">${n.subtitle}</p><p class="article-body">${n.content}</p><div class="button-row"><button class="btn outline" data-action="share">Compartir</button>${favButton(`news:${n.id}`,'Guardar noticia')}</div>`}function transfersView(){return `<div class="eyebrow">MERCADO MUNICIPAL</div><h1 class="screen-title">Fichajes</h1><div class="empty-state"><div class="empty-illustration"></div><h2>Sin movimientos oficiales publicados</h2><p>No mostramos rumores, altas ni cambios de equipo sin una publicación oficial de la Liga.</p></div>`}
function favoritesView(){const ids=state.favorites;if(!ids.length)return `<div class="empty-state"><div class="empty-illustration"></div><h2>Sin favoritos todavía</h2><p>Guarda equipos, jugadores, partidos y noticias para encontrarlos aquí.</p><button class="btn outline" data-route="search">Explorar</button></div>`;return `<div class="eyebrow">TU COLECCIÓN</div><h1 class="screen-title">Favoritos</h1><div class="favorite-list">${ids.map(id=>favoriteCard(id)).join('')}</div>`}function favoriteCard(id){const [type,key]=id.split(':');if(type==='team'){const t=team(key);return `<div class="favorite-card"><button data-team="${key}">${crest(key)}<span><b>${t.name}</b><small>Equipo</small></span></button>${favButton(id)}</div>`}if(type==='player'){const p=player(key);return `<div class="favorite-card"><button data-player="${key}">${crest(p.team)}<span><b>${p.name}</b><small>Jugador</small></span></button>${favButton(id)}</div>`}if(type==='match'){const m=matches.find(x=>x.id===key);return `<div class="favorite-card"><button data-match="${key}">${crest(m.home)}<span><b>${team(m.home).name} vs ${team(m.away).name}</b><small>Partido</small></span></button>${favButton(id)}</div>`}if(type==='news'){const n=news.find(x=>x.id===key);return `<div class="favorite-card"><button data-news="${key}"><span class="mini-news"></span><span><b>${n.title}</b><small>Noticia</small></span></button>${favButton(id)}</div>`}return ''}
function normLeagueSearch(s){
  try{return String(s||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim()}
  catch(e){return String(s||'').toLowerCase().trim()}
}
function searchView(){
  return '<div class="eyebrow">EXPLORAR</div><h1 class="screen-title">Buscar</h1>'+
    '<div class="searchbox"><span>'+icons.search+'</span><input id="globalSearch" type="search" autocomplete="off" placeholder="Equipos, jugadores, partidos, campos..." value="'+(state.searchQuery||'')+'"></div>'+
    '<div id="searchResults">'+searchResultsHtml(state.searchQuery||'')+'</div>';
}
function searchResultsHtml(q){
  const raw=String(q||''),needle=normLeagueSearch(raw);
  const tools=[
    ['Reglamento','rulebook','Reglamento oficial documentos PDF'],
    ['Match Day','matchday','jornada partidos operación'],
    ['Clima y campos','weatherFields','clima campo sede lluvia'],
    ['Dónde se juega','venues','campos sedes comunidades mapas'],
    ['Cédulas','cedulas','cedulas partidos documentos'],
    ['Credencial','credential','credencial jugador deportiva'],
    ['Publicaciones','publications','whatsapp compartir jornada'],
    ['QR de la Liga','ligaQR','qr compartir app acceso'],
    ['Rankings de la Liga','rankings','ranking clubes clasificación'],
    ['Historia','history','historia temporadas campeones finales'],
    ['Facebook oficial de la Liga','history','facebook tablas calendarios avisos campeones historia fotografias'],
    ['Avisos de la Liga','notices','avisos comunicados cambios horarios sedes jornada'],
    ['Centro de avisos','scheduleChanges','crear enviar compartir aviso cambio horario sede suspension whatsapp'],
    ['Máximo goleador','scorers','goleadores jugadores goles'],
    ['Equipos','teams','clubes equipos'],
    ['Siguiendo','following','equipos seguidos favoritos']
  ];
  if(!needle){
    return '<section class="section">'+sectionHead('Accesos rápidos')+
      '<div class="quick-grid">'+
        '<button data-route="teams">Equipos</button>'+
        '<button data-route="players">Jugadores</button>'+
        '<button data-route="competition">Partidos</button>'+
        '<button data-route="venues">Campos</button>'+
        '<button data-route="news">Noticias</button>'+
        '<button data-route="ligaQR">QR de la Liga</button>'+
      '</div></section>';
  }
  const ts=teams.filter(t=>normLeagueSearch([t.name,t.category,t.field,t.news].join(' ')).includes(needle));
  const ps=players.filter(p=>normLeagueSearch([p.name,p.position,team(p.team).name].join(' ')).includes(needle));
  const ns=news.filter(n=>normLeagueSearch([n.title,n.category,n.subtitle,n.content].join(' ')).includes(needle));
  const ms=matches.filter(m=>normLeagueSearch([team(m.home).name,team(m.away).name,m.category,m.day,m.date,m.time,m.venue,m.referee].join(' ')).includes(needle));
  const fs=(typeof V60_FIELDS!=='undefined'?V60_FIELDS:[]).filter(f=>normLeagueSearch([f.name,f.community,f.address].join(' ')).includes(needle));
  const us=tools.filter(x=>normLeagueSearch(x.join(' ')).includes(needle));
  const parts=[];
  if(ts.length)parts.push(sectionHead('Equipos')+ts.map(t=>'<button class="search-result" data-team="'+t.code+'">'+crest(t.code)+'<span><b>'+t.name+'</b><small>'+t.category+'</small></span></button>').join(''));
  if(ps.length)parts.push(sectionHead('Jugadores')+ps.map(p=>'<button class="search-result" data-player="'+p.id+'">'+crest(p.team)+'<span><b>'+p.name+'</b><small>'+p.position+' · '+team(p.team).name+'</small></span></button>').join(''));
  if(ms.length)parts.push(sectionHead('Partidos')+ms.map(m=>'<button class="search-result" data-match="'+m.id+'">'+crest(m.home)+'<span><b>'+team(m.home).name+' vs '+team(m.away).name+'</b><small>'+m.day+' · '+m.time+' · '+m.venue+'</small></span></button>').join(''));
  if(fs.length)parts.push(sectionHead('Campos y sedes')+fs.map(f=>'<button class="search-result" data-route="venues"><span class="mini-news"></span><span><b>'+f.name+'</b><small>'+f.community+'</small></span></button>').join(''));
  if(ns.length)parts.push(sectionHead('Noticias')+ns.map(n=>'<button class="search-result" data-news="'+n.id+'"><span class="mini-news"></span><span><b>'+n.title+'</b><small>'+n.category+'</small></span></button>').join(''));
  if(us.length)parts.push(sectionHead('Herramientas')+us.map(x=>'<button class="search-result" data-route="'+x[1]+'"><span class="mini-news"></span><span><b>'+x[0]+'</b><small>Liga Municipal de Fútbol</small></span></button>').join(''));
  return '<section class="section">'+(parts.length?parts.join(''):'<div class="empty-mini">No encontramos resultados en la Liga.</div>')+'</section>';
}
function officialVoteCandidates(){
  const selected=String(localStorage.getItem('v62-category')||'');
  const db=window.LJR_OFFICIAL_DATA;
  const rowsFor=(id)=>{
    const cat=db?.categories?.[String(id)];
    const block=cat?.scorers?.[0];
    return (block?.rows||[]).filter(r=>r.length>=4&&/^\d+$/.test(String(r[3]||''))).map(r=>({
      id:'official:'+String(id)+':'+String(r[1]||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''),
      name:String(r[1]||'').trim(),
      team:String(r[2]||'').trim(),
      goals:Number(r[3]||0),
      category:String(cat?.name||'Liga Juventino Rosas')
    }));
  };
  let list=[];
  if(db&&selected){
    const own=rowsFor(selected);
    if(own.length>=4)list=own;
  }
  if(db&&list.length<4){
    list=Object.keys(db.categories||{}).flatMap(rowsFor);
  }
  if(!list.length){
    /* Respaldo verificado contra data/official-live.json del 19-09-2026.
       Evita volver a mostrar nombres o equipos ficticios mientras carga la fuente oficial. */
    list=[
      {id:'official:1:hugo-armenta-buenavista',name:'Hugo Armenta Buenavista',team:'DYNAMO',goals:5,category:'Veteranos 50+'},
      {id:'official:4:telesforo-freyre-valadez',name:'TELESFORO FREYRE VALADEZ',team:'DEP. NOPALERO',goals:4,category:'Segunda Fuerza'},
      {id:'official:1:j-carmen-subias-miranda',name:'J. Carmen Subias Miranda',team:'MANCHESTER',goals:4,category:'Veteranos 50+'},
      {id:'official:1:jose-mendoza-pescador',name:'Jose Mendoza Pescador',team:'LA ESPERANZA',goals:3,category:'Veteranos 50+'}
    ];
  }
  const seen=new Set();
  return list
    .filter(x=>x.name&&x.team&&!seen.has((x.name+'|'+x.team).toLowerCase())&&seen.add((x.name+'|'+x.team).toLowerCase()))
    .sort((a,b)=>b.goals-a.goals||a.name.localeCompare(b.name,'es'))
    .slice(0,4);
}
function officialVoteTeamLogo(name){
  const fromRegistry=window.LJR_TEAM_LOGOS?.get?.(name);
  if(fromRegistry)return fromRegistry;
  const base='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const key=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
  const map={
    'dynamo':'assets/official-logos/dynamo.png',
    'dep nopalero':'assets/official-logos/dep-nopalero.png',
    'deportivo nopalero':'assets/official-logos/dep-nopalero.png',
    'manchester':'assets/official-logos/manchester.png',
    'la esperanza':'assets/official-logos/la-esperanza.png',
    'atl galeana':'assets/official-logos/galeana.png',
    'atletico galeana':'assets/official-logos/galeana.png',
    'promesas fc':'assets/official-logos/promesas-fc.png',
    'aldama fc':'assets/official-logos/aldama-fc.png',
    'celticos':'assets/official-logos/celticos.png',
    'dep zapata':'assets/official-logos/dep-zapata.png'
  };
  return map[key]?base+map[key]:'';
}
function officialVoteInitials(name){
  const parts=String(name||'').trim().split(/\s+/).filter(Boolean);
  return ((parts[0]?.[0]||'')+(parts.length>1?parts[parts.length-1][0]:'')).toUpperCase();
}
function voteView(){
  const candidates=officialVoteCandidates();
  const validVote=candidates.some(p=>p.id===state.vote)?state.vote:null;
  if(state.vote&&!validVote){state.vote=null;save()}
  return `<div class="eyebrow">VOTACIÓN</div><h1 class="screen-title">Jugador de la Jornada</h1><p class="muted">Candidatos tomados de jugadores y equipos registrados en la Liga. Elige una sola vez; tu voto queda guardado en este dispositivo.</p><div class="vote-grid">${candidates.map(p=>{
    const logo=officialVoteTeamLogo(p.team);
    const teamMark=logo
      ?`<span class="vote-team-logo"><img src="${logo}" alt="${p.team}" loading="lazy" decoding="async"></span>`
      :`<span class="vote-team-logo fallback">${p.team.slice(0,3)}</span>`;
    return `<button class="vote-card ${state.vote===p.id?'selected':''}" data-vote="${p.id}" data-vote-name="${p.name.replace(/"/g,'&quot;')}" ${state.vote&&state.vote!==p.id?'disabled':''}><div class="avatar-ball vote-player-initials">${officialVoteInitials(p.name)}</div>${teamMark}<b>${p.name}</b><small class="vote-team-name">${p.team}</small><small>${p.goals} goles · ${p.category}</small><span>${state.vote===p.id?'VOTADO':'VOTAR'}</span></button>`;
  }).join('')}</div>`;
}
function notificationsView(){return `<div class="eyebrow">PREFERENCIAS</div><h1 class="screen-title">Notificaciones</h1>${sectionHead('Partidos')}<div class="settings-card">${switchRow('goal','Goles','Alertas cuando cambie el marcador')}${switchRow('kickoff','Inicio de partido')}${switchRow('halftime','Medio tiempo')}${switchRow('final','Final del partido')}</div>${sectionHead('Contenido')}<div class="settings-card">${switchRow('news','Noticias')}${switchRow('video','Nuevos videos')}${switchRow('transfers','Fichajes')}</div>${sectionHead('Juegos')}<div class="settings-card">${switchRow('fantasy','Fantasy')}${switchRow('predictor','Quiniela')}</div>`}function privacyView(){return `<div class="eyebrow">TU PRIVACIDAD</div><h1 class="screen-title">Privacidad</h1><div class="profile-card"><h2>Controla tus datos</h2><p>Estas preferencias se guardan localmente. Cuando conectemos Firebase, podrán sincronizarse con tu cuenta.</p></div><div class="settings-card section"><label class="setting-row"><span><b>Analítica opcional</b><small>Ayuda a mejorar la app</small></span><input type="checkbox" data-privacy="analytics" ${state.privacy.analytics?'checked':''}><i></i></label><label class="setting-row"><span><b>Personalización</b><small>Ordenar contenido según tus equipos</small></span><input type="checkbox" data-privacy="personalization" ${state.privacy.personalization?'checked':''}><i></i></label></div><button class="btn primary full section" data-action="accept-privacy">${state.privacy.accepted?'Preferencias guardadas':'Aceptar y guardar'}</button>`}
function historyView(){return `<div class="eyebrow">ARCHIVO MUNICIPAL</div><h1 class="screen-title">Historia</h1><div class="tabs">${['Resumen','Temporadas','Campeones','Finales','Récords'].map(x=>`<button class="tab ${state.historyTab===x?'active':''}" data-history-tab="${x}">${x}</button>`).join('')}</div>${historyBody()}`}
function historyBody(){return `<section class="section"><div class="empty-state"><div class="empty-illustration"></div><h2>Archivo histórico</h2><p>No se muestran campeones, finales o récords sin una fuente oficial publicada.</p></div></section>`}
function profileView(){return `<div class="eyebrow">CUENTA</div><h1 class="screen-title">Perfil</h1>${state.user?`<div class="profile-card"><div class="avatar-ball">${state.user.name.slice(0,1).toUpperCase()}</div><h2>${state.user.name}</h2><p>${state.user.email}</p><button class="btn outline" data-action="logout">Cerrar sesión</button></div>`:`<div class="profile-card"><h2>Más de Liga Juventino</h2><p>Inicia sesión para guardar tu identidad, tu Fantasy y tus preferencias.</p><div class="button-row"><button class="btn primary" data-action="login-demo">Iniciar sesión</button><button class="btn outline" data-action="login-demo">Crear cuenta</button></div></div>`}${menuGroup('Tu contenido',[['Favoritos','favorites',`${state.favorites.length} guardados`],['Siguiendo','following',`${state.followed.length} equipos`],['Mi Fantasy','fantasyTeam'],['Quiniela','predictor']])}${menuGroup('Ajustes',[['Notificaciones','notifications'],['Privacidad','privacy'],['Cambiar tema','theme']])}`}
function predictorView(){
  return `<section class="v37-predictor-reference" aria-label="Pronostica Seis">
    <img
      class="v37-predictor-reference-image"
      src="./assets/reference/predictor-master.png?v=20260919-predictor-master"
      alt="Pronostica Seis"
      draggable="false"
    >
    <button type="button" class="v37-predictor-enter" data-route="predictorSix" aria-label="Abrir Pronostica Seis"></button>
    <nav class="v37-predictor-hotnav" aria-label="Navegación">
      <button type="button" data-route="home" aria-label="Inicio"></button>
      <button type="button" data-route="competition" aria-label="Competición"></button>
      <button type="button" data-route="video" aria-label="Vídeo"></button>
      <button type="button" data-route="fantasy" aria-label="Fantasy"></button>
      <button type="button" data-route="more" aria-label="Más"></button>
    </nav>
  </section>`;
}

function predictorSixView(){
  const BASE='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/';
  const games=[
  [
    "p6a",
    "FRANCO FC",
    "assets/official-logos/franco-fc.png",
    "HERRERAS FC",
    "assets/official-logos/herreras-fc.png"
  ],
  [
    "p6b",
    "TERRICOLAS",
    "assets/official-logos/terricolas.png",
    "GALACTICOS",
    "assets/teams/galacticos-pozos.webp"
  ],
  [
    "p6c",
    "LINCES",
    "assets/official-logos/linces.png",
    "JUVENTUS",
    "assets/official-logos/juventus.png"
  ],
  [
    "p6d",
    "HERMANOS",
    "assets/official-logos/hermanos.png",
    "SAN JOSE FC",
    "assets/official-logos/san-jose-fc.png"
  ],
  [
    "p6e",
    "LOBOS CDG",
    "assets/official-logos/lobos-cdg.png",
    "NAPOLI",
    "assets/official-logos/napoli.png"
  ],
  [
    "p6f",
    "HERMANOS",
    "assets/official-logos/hermanos.png",
    "ABEJAS",
    "assets/official-logos/abejas.png"
  ]
];

  const slides=[
    ['Pronostica seis resultados','Consigue puntos por el marcador, la diferencia de goles y los goles marcados por cada equipo.'],
    ['Elige tus marcadores','Toca cada partido para cambiar tu pronóstico entre 1, X y 2. Tus selecciones se guardan en este dispositivo.'],
    ['Suma puntos en cada jornada','Mientras más aciertos tengas, más puntos acumulas en Pronostica Seis de la Liga Municipal.'],
    ['Compite con tus amigos','Completa los seis partidos y compara tus resultados con otros aficionados de la Liga Juventino Rosas.']
  ];
  const slide=((state.predictorSlide||0)%slides.length+slides.length)%slides.length;
  const title=slides[slide][0], desc=slides[slide][1];
  const pickFor=id=>state.predictions['six:'+id]?.pick||'?';
  return `<section class="v53-predictor-six" aria-label="Pronostica Seis">
    <header class="v53-p6-head">
      <button type="button" class="v53-p6-back" data-route="predictor" aria-label="Volver a Pronostica Seis">
        <svg viewBox="0 0 48 48" aria-hidden="true"><path d="M31 8 15 24l16 16M16 24h27"/></svg>
      </button>
      <h1>Pronostica Seis</h1>
    </header>

    <div class="v53-p6-sponsor">
      <span>Patrocinado por</span>
      <span class="v53-p6-sponsor-mark"><img src="./assets/reference/predictor-v36/liga-crest-white.webp" alt="" aria-hidden="true"><b>LIGA JUVENTINO</b></span>
    </div>

    <div class="v53-p6-stage">
      <div class="v53-p6-grid">
        ${games.map(([id,a,alogo,b,blogo])=>`<button type="button" class="v53-p6-game ${pickFor(id)!=='?'?'is-picked':''}" data-v29-pick="${id}" data-v29-default="?" aria-label="${a} contra ${b}. Pronóstico ${pickFor(id)}">
          <span class="v53-p6-team"><img src="${BASE+alogo}" alt="${a}"></span>
          <span class="v53-p6-vs">VS</span>
          <span class="v53-p6-team"><img src="${BASE+blogo}" alt="${b}"></span>
          <strong class="v53-p6-pick">${pickFor(id)}</strong>
        </button>`).join('')}
      </div>
      <button type="button" class="v53-p6-next" data-v53-next aria-label="Siguiente explicación">
        <svg viewBox="0 0 32 52" aria-hidden="true"><path d="m7 5 18 21L7 47"/></svg>
      </button>
    </div>

    <div class="v53-p6-copy">
      <h2>${title}</h2>
      <p>${desc}</p>
      <div class="v53-p6-dots" aria-label="Página ${slide+1} de 4">
        ${slides.map((_,i)=>`<i class="${i===slide?'active':''}"></i>`).join('')}
      </div>
    </div>

    <div class="v53-p6-actions">
      <button type="button" class="v53-p6-primary" data-action="login-demo">${state.user?'Continuar como '+state.user.name:'Inicia sesión para jugar'}</button>
      <button type="button" class="v53-p6-secondary" data-v53-guest>Prueba como invitado</button>
    </div>
  </section>`;
}
function videoView(){return `<div class="hero video-hero"><span class="eyebrow" style="color:#fff">REVIVE LA JORNADA</span><h1>FÚTBOL QUE<br>NOS UNE</h1><p>Mira goles, atajadas, entrevistas y resúmenes completos.</p><div class="button-row"><button class="btn primary" data-video="Resumen de la Jornada">Ver ahora</button><button class="btn outline" data-match="m1">Partido de la semana</button></div></div><section class="section">${sectionHead('Selección del editor')}<div class="media-carousel"><button class="media-card" data-video="Momentos de la Liga"><span class="badge">VIDEO</span><h3>Momentos de la Liga</h3></button><button class="media-card" data-video="Resumen de la jornada"><span class="badge">08:20</span><h3>Resumen de la jornada</h3></button></div></section>`}
function momentsView(){return `<div class="v26-moments-original" aria-label="Momentos">
  <div class="v26-moments-sticky" aria-label="Cabecera fija de Momentos">
    <img class="v26-moments-sticky__image" src="./assets/moments/moments-original-a.png?v=20260918-moments3" alt="" aria-hidden="true" draggable="false">
    <button type="button" class="v26-moments-sticky-back" data-route="more" aria-label="Volver a Más"></button>
  </div>
  <section class="v26-moments-panel" data-v26-panel="a" aria-label="Momentos principales">
    <img class="v26-moments-original__image" src="./assets/moments/moments-original-a.png?v=20260918-moments3" alt="Momentos de la Liga Municipal de Fútbol Juventino Rosas" draggable="false">

    <button class="v26-moments-hotspot v26-back" data-route="more" aria-label="Volver a Más"></button>

    <button class="v26-moments-hotspot v26-card v26-card-1" data-video="Juventino Rosas · Momento 1" aria-label="Ver momento de Juventino Rosas"></button>
    <button class="v26-moments-hotspot v26-card v26-card-2" data-video="Juventino Rosas · Momento 2" aria-label="Ver segundo momento de Juventino Rosas"></button>
    <button class="v26-moments-hotspot v26-card v26-card-3" data-video="La Huerta" aria-label="Ver momento de La Huerta"></button>
    <button class="v26-moments-hotspot v26-card v26-card-4" data-video="Pozos" aria-label="Ver momento de Pozos"></button>
    <button class="v26-moments-hotspot v26-card v26-card-5" data-video="Rincón de Centeno" aria-label="Ver momento de Rincón de Centeno"></button>
    <button class="v26-moments-hotspot v26-card v26-card-6" data-video="Deportivo Rosas" aria-label="Ver momento de Deportivo Rosas"></button>

    <button class="v26-moments-hotspot v26-nav v26-nav-home" data-route="home" aria-label="Inicio"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-competition" data-route="competition" aria-label="Competición"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-video" data-route="video" aria-label="Vídeo"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-fantasy" data-route="fantasy" aria-label="Fantasy"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-more" data-route="more" aria-label="Más"></button>
  </section>

  <section class="v26-moments-panel" data-v26-panel="b" aria-label="Más momentos">
    <img class="v26-moments-original__image" src="./assets/moments/moments-original-b.png?v=20260918-moments3" alt="Más momentos de la Liga Municipal de Fútbol Juventino Rosas" draggable="false">

    <button class="v26-moments-hotspot v26-back" data-route="more" aria-label="Volver a Más"></button>

    <button class="v26-moments-hotspot v26-card v26-card-1" data-video="Club América Veteranos" aria-label="Ver momento de Club América Veteranos"></button>
    <button class="v26-moments-hotspot v26-card v26-card-2" data-video="Juventino Rosas" aria-label="Ver momento de Juventino Rosas"></button>
    <button class="v26-moments-hotspot v26-card v26-card-3" data-video="Atlético Galeana" aria-label="Ver momento de Atlético Galeana"></button>
    <button class="v26-moments-hotspot v26-card v26-card-4" data-video="La Huerta" aria-label="Ver momento de La Huerta"></button>
    <button class="v26-moments-hotspot v26-card v26-card-5" data-video="Santa Cruz" aria-label="Ver momento de Santa Cruz"></button>
    <button class="v26-moments-hotspot v26-card v26-card-6" data-video="Pozos" aria-label="Ver momento de Pozos"></button>

    <button class="v26-moments-hotspot v26-nav v26-nav-home" data-route="home" aria-label="Inicio"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-competition" data-route="competition" aria-label="Competición"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-video" data-route="video" aria-label="Vídeo"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-fantasy" data-route="fantasy" aria-label="Fantasy"></button>
    <button class="v26-moments-hotspot v26-nav v26-nav-more" data-route="more" aria-label="Más"></button>
  </section>
</div>`}
function scorersView(){return `<div class="eyebrow">ESTADÍSTICAS</div><h1 class="screen-title">Máximo goleador</h1><button class="scorer-feature" data-route="scorers"><span class="badge">#1 GOLEADOR OFICIAL PUBLICADO</span><div><small>DYNAMO · Veteranos 50+</small><h2>Hugo Armenta Buenavista</h2><b>5 <em>goles</em></b><small>Asistencias no publicadas por la fuente oficial</small></div></button><section class="section">${sectionHead('Clasificación completa')}<div class="stat-card">${players.slice().sort((a,b)=>b.goals-a.goals).slice(0,8).map((p,i)=>`<button class="rank-row" data-player="${p.id}"><b>${i+1}</b>${crest(p.team)}<span>${p.name}</span><b>${p.goals}</b></button>`).join('')}</div></section>`}
function rankingsView(){return `<div class="eyebrow">TEMPORADA 2026</div><h1 class="screen-title">Rankings</h1><div class="segmented"><button class="segment active">Clubes</button><button class="segment">Jugadores</button><button class="segment">Forma</button></div><div class="table-wrap"><table class="table"><thead><tr><th>#</th><th>Equipo</th><th>PJ</th><th>DG</th><th>Pts</th></tr></thead><tbody>${teams.map((t,i)=>`<tr><td>${i+1}</td><td>${teamCell(t.code)}</td><td>${t.p}</td><td>${t.gd}</td><td><b>${t.pts}</b></td></tr>`).join('')}</tbody></table></div>`}
function followingView(){const list=teams.filter(t=>state.followed.includes(t.code));if(!list.length)return `<div class="empty-state"><div class="empty-illustration"></div><h2>Sin equipos seguidos todavía</h2><p>Añade equipos para personalizar tu inicio, resultados y alertas.</p><button class="btn outline" data-route="teams">+ Añadir equipos</button></div>`;return `<div class="eyebrow">PERSONALIZADO</div><h1 class="screen-title">Siguiendo</h1><div class="team-list">${list.map(t=>`<div class="team-row"><button class="team-main" data-team="${t.code}">${crest(t.code)}<span><b>${t.name}</b><small>${t.news}</small></span></button><button class="mini-btn active" data-follow="${t.code}">Siguiendo</button></div>`).join('')}</div>`}

const V19_MORE_LOGO='https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp';
function v19MoreIcon(name){
  const icons={
    star:'<path d="m12 2.7 2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3.1-5.8 3.1 1.1-6.5-4.7-4.6 6.5-.9Z"/>',
    shield:'<path d="M12 2.8 19 5.7v5.1c0 4.7-2.9 8.8-7 10.4-4.1-1.6-7-5.7-7-10.4V5.7L12 2.8Z"/><path d="m12 7 1.2 2.3 2.6.4-1.9 1.8.5 2.6-2.4-1.2-2.4 1.2.5-2.6-1.9-1.8 2.6-.4L12 7Z"/>',
    performance:'<path d="M4 7h4M6 5v4m10-4h4m-2-2v4M5 18l4-4 3 2 7-7"/><circle cx="5" cy="18" r="1.5"/><circle cx="9" cy="14" r="1.5"/><circle cx="12" cy="16" r="1.5"/><circle cx="19" cy="9" r="1.5"/>',
    medal:'<circle cx="12" cy="13.5" r="6.4"/><path d="M9.5 2.5 12 7l2.5-4.5M5.8 5.2 8 8.3m10.2-3.1L16 8.3M12 10.2l1 2.1 2.3.3-1.7 1.6.4 2.3-2-1.1-2 1.1.4-2.3-1.7-1.6 2.3-.3 1-2.1Z"/>',
    video:'<rect x="3.5" y="6" width="17" height="14" rx="1"/><path d="M7 3.5 9 6m3-2.5L14 6m3-2.5L19 6M9.5 10.2l5.5 3.1-5.5 3.1Z"/>',
    data:'<path d="M5 20V11m7 9V5m7 15v-7"/>',
    score:'<rect x="3.2" y="7" width="17.6" height="11" rx="1"/><path d="M8 10.2v4.6m8-4.6v4.6M10.2 12.5h3.6"/>',
    quiz:'<rect x="5" y="4" width="14" height="15" rx="1.4"/><path d="m8.5 11 2.2 2.1 4.7-5M3 7v14h13"/>',
    arrows:'<path d="M8 3v17m0-17L4.7 6.5M8 3l3.3 3.5M16 21V4m0 17-3.3-3.5M16 21l3.3-3.5"/>',
    glasses:'<path d="M6 3h4l-.6 7a2.4 2.4 0 0 1-4.8 0L4 3h2Zm0 9v7m-2 2h4M16 3h4l-.6 7a2.4 2.4 0 0 1-4.8 0L14 3h2Zm0 9v7m-2 2h4"/>',
    trophy:'<path d="M8 4h8v4.8a4 4 0 0 1-8 0V4Zm4 9v5m-4 3h8M8 6H4v1.5A4.5 4.5 0 0 0 8.5 12M16 6h4v1.5a4.5 4.5 0 0 1-4.5 4.5"/>',
    history:'<path d="M4 7V3m0 0h4M4.4 3.6A9 9 0 1 1 3 14"/><path d="M12 7v5l3.5 2"/>',
    bag:'<path d="M5 8h14l1 13H4L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10h.01"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    qr:'<rect x="3" y="3" width="6" height="6" rx=".5"/><rect x="15" y="3" width="6" height="6" rx=".5"/><rect x="3" y="15" width="6" height="6" rx=".5"/><path d="M12 4v3m0 3v2m3 0h3m3 0v3m-9 0h3v3h3v3m3-3v3"/>'

  };
  return '<span class="v19-more-icon"><svg viewBox="0 0 24 24" aria-hidden="true">'+(icons[name]||icons.info)+'</svg></span>';
}
function v19MoreButton(icon,label,route,safe=false){
  const attr=safe?'data-safe-route="'+route+'"':'data-route="'+route+'"';
  return '<button type="button" class="v19-more-item" '+attr+'>'+v19MoreIcon(icon)+'<span>'+label+'</span></button>';
}

const V60_RULEBOOK='./docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf';
const V60_RULEBOOK_PUBLIC='https://jairofrancog7-star.github.io/App-liga-/docs/Reglamento_Liga_Juventino_Rosas_2026_2027.pdf';
const V60_FIELDS=[
  {id:'sur-1',name:'Campo 1 · Unidad Deportiva Sur',community:'Juventino Rosas',address:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',lat:20.63753,lon:-100.99297,weather:true},
  {id:'sur-2',name:'Campo 2 · Unidad Deportiva Sur',community:'Juventino Rosas',address:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',lat:20.63753,lon:-100.99297,weather:true},
  {id:'sur-3',name:'Campo 3 · Unidad Deportiva Sur',community:'Juventino Rosas',address:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Sur, Juventino Rosas, Guanajuato',lat:20.63753,lon:-100.99297,weather:true},
  {id:'zapata-4',name:'Campo 4 · Emiliano Zapata',community:'Juventino Rosas',address:'Prolongación Emiliano Zapata, Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/vTCjxxked88JuKCY6',lat:null,lon:null,weather:true,weatherLat:20.64337,weatherLon:-100.99286,weatherPrecision:'regional'},
  {id:'cerrito',name:'Campo Cerrito de Gasca',community:'Cerrito de Gasca',address:'Cerrito de Gasca, Santa Cruz de Juventino Rosas, Guanajuato',maps:'Campo de futbol Cerrito de Gasca, Guanajuato',lat:20.617778,lon:-101.0625,weather:true},
  {id:'tavera',name:'Campo de Tavera',community:'Franco Tavera',address:'Franco Tavera, Santa Cruz de Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/pDsYt63hKVwRTUWS9',lat:20.60839,lon:-100.93238,weather:true},
  {id:'san-juan',name:'Campo San Juan de la Cruz',community:'San Juan de la Cruz',address:'San Juan de la Cruz, Santa Cruz de Juventino Rosas, Guanajuato 38250',maps:'https://maps.app.goo.gl/VJkp1fRa9t5yzfkb9',streetViewQuery:'Campo San Juan de la Cruz, Santa Cruz de Juventino Rosas, Guanajuato',lat:null,lon:null,weather:true,weatherLat:20.63379,weatherLon:-100.911569,weatherPrecision:'community'},
  {id:'cuenda',name:'Unidad Deportiva Santiago de Cuenda',community:'Santiago de Cuenda',address:'38253 Santiago de Cuenda, Santa Cruz de Juventino Rosas, Guanajuato',maps:'Unidad Deportiva Santiago de Cuenda, Guanajuato',lat:20.59793,lon:-100.99663,weather:true},
  {id:'romerillo',name:'Campo San Antonio de Romerillo',community:'San Antonio de Romerillo',address:'San Antonio de Romerillo, Santa Cruz de Juventino Rosas, Guanajuato 38255',maps:'https://maps.app.goo.gl/K46mpaJvHMMtnUq27',lat:20.60784,lon:-100.94854,weather:true},
  {id:'fraccionamiento',name:'Campo Fraccionamiento Comontuoso',community:'Comontuoso / Santiago de Cuenda',address:'Fraccionamiento Comontuoso, Santa Cruz de Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/frhHxqfK9TAd3NhE8',lat:null,lon:null,weather:true,weatherLat:20.59793,weatherLon:-100.99663,weatherPrecision:'community'},
  {id:'pozos',name:'Campo de Fútbol de Pozos',community:'Pozos',address:'Campo de Fútbol de Pozos, Santa Cruz de Juventino Rosas, Guanajuato',maps:'20.61767,-100.90033',lat:20.61767,lon:-100.90033,weather:true},
  {id:'rincon',name:'Campo Rincón de Centeno',community:'Rincón de Centeno',address:'Campo Rincón de Centeno · ubicación exacta en Google Maps',maps:'https://maps.app.goo.gl/RzxJokJsPw86ZePC9',streetViewQuery:'Campo Rincón de Centeno, Santa Cruz de Juventino Rosas, Guanajuato',lat:null,lon:null,weather:true,weatherLat:20.660153,weatherLon:-100.886766,weatherPrecision:'community'},
  {id:'san-jose',name:'Campo San José de la Montaña',community:'San José de la Montaña',address:'San José de la Montaña, Salamanca, Guanajuato 36867',maps:'Campo de futbol San José de la Montaña, Guanajuato',lat:20.60102,lon:-101.07242,weather:true},
  {id:'san-julian',name:'Campo San Julián Tierra Blanca',community:'San Julián Tierra Blanca',address:'Los Fundadores 100, San Julián Tierra Blanca, Santa Cruz de Juventino Rosas, Guanajuato',maps:'https://maps.app.goo.gl/Rkb9PH3LF5pVu2FTA',lat:20.591403,lon:-101.040358,weather:true}
];
function v60Field(id){return V60_FIELDS.find(f=>f.id===id)||V60_FIELDS[0]}
function v60MapUrl(f){const m=f.maps||f.address||f.name;return /^https?:\/\//i.test(m)?m:'https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(m)}
function v60HasExactMap(f){return /^https?:\/\//i.test(String(f?.maps||''))}
function v60FieldPreview(f,cls=''){
  if(f?.streetViewQuery){
    const src='https://maps.google.com/maps?q='+encodeURIComponent(f.streetViewQuery)+'&layer=c&output=svembed';
    return '<span class="v60-field-preview '+cls+'"><iframe src="'+src+'" title="Vista a nivel de calle de '+String(f.name||'campo').replace(/"/g,'&quot;')+'" loading="lazy" tabindex="-1" aria-hidden="true" referrerpolicy="no-referrer-when-downgrade"></iframe></span>';
  }
  if(Number.isFinite(Number(f?.lat))&&Number.isFinite(Number(f?.lon))){
    const lat=Number(f.lat).toFixed(6),lon=Number(f.lon).toFixed(6);
    const src='https://maps.google.com/maps?q=&layer=c&cbll='+lat+','+lon+'&cbp=11,0,0,0,0&output=svembed';
    return '<span class="v60-field-preview '+cls+'"><iframe src="'+src+'" title="Vista de '+String(f.name||'campo').replace(/"/g,'&quot;')+'" loading="lazy" tabindex="-1" aria-hidden="true" referrerpolicy="no-referrer-when-downgrade"></iframe></span>';
  }
  return '<span class="v60-field-preview '+cls+'"><img src="./assets/reference/predictor-v36/predictor-stadium.webp" alt="" loading="lazy" decoding="async"></span>';
}
function v60Icon(name){
  const p={
    rules:'<path d="M6 3h10a3 3 0 0 1 3 3v15H8a3 3 0 0 1-3-3V4a1 1 0 0 1 1-1Z"/><path d="M8 7h8M8 11h8M8 15h5"/>',
    matchday:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4m8-4v4M4 10h16M8 14l2 2 5-5"/>',
    weather:'<path d="M7 18h10a4 4 0 0 0 0-8 6 6 0 0 0-11.2-1.8A4.7 4.7 0 0 0 7 18Z"/><path d="M8 21v-1m4 1v-1m4 1v-1"/>',
    field:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M12 5v14"/><circle cx="12" cy="12" r="3"/>',
    cedula:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="9" cy="9" r="2.2"/><path d="M7 15h10M13 8h4M13 11h4"/>',
    tools:'<path d="m14 6 4-4 4 4-4 4m-7 3-7 7m2-11 9 9"/><circle cx="7" cy="6" r="3"/>',
    center:'<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M8 9h8M8 13h5M8 17h8"/>',
    bracket:'<path d="M5 4h5v4H5zM14 8h5v4h-5zM5 12h5v4H5zM14 16h5v4h-5zM10 6h2v12h2"/>',
    card:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8" cy="11" r="2"/><path d="M12 9h6M12 12h6M6 16h12"/>',
    share:'<circle cx="18" cy="5" r="2"/><circle cx="6" cy="12" r="2"/><circle cx="18" cy="19" r="2"/><path d="m8 11 8-5M8 13l8 5"/>',
    tactics:'<path d="M4 20V4h16v16H4Z"/><circle cx="12" cy="12" r="3"/><path d="M12 4v16M7 7h2m6 10h2"/>',
    sim:'<path d="M4 18h16M6 15l3-4 3 2 5-7"/><path d="M15 6h3v3"/>',
    admin:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3M5 5l2 2m10 10 2 2M19 5l-2 2M7 17l-2 2"/>',
    search:'<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
    qr:'<rect x="3" y="3" width="6" height="6" rx=".5"/><rect x="15" y="3" width="6" height="6" rx=".5"/><rect x="3" y="15" width="6" height="6" rx=".5"/><path d="M12 4v3m0 3v2m3 0h3m3 0v3m-9 0h3v3h3v3m3-3v3"/>'

  };
  return '<svg viewBox="0 0 24 24" aria-hidden="true">'+(p[name]||p.tools)+'</svg>';
}
function v60ToolCard(icon,title,sub,route,extra=''){
  return '<button type="button" class="v60-tool-card" '+(route?'data-route="'+route+'"':'')+' '+extra+'>'+v60Icon(icon)+'<span><b>'+title+'</b><small>'+sub+'</small></span></button>';
}
function v60Header(kicker,title,desc){
  return '<div class="v60-tool-head"><span class="v60-tool-kicker">'+kicker+'</span><h1>'+title+'</h1><p>'+desc+'</p></div>';
}
function leagueToolsView(){
  return '<section class="v60-tool-page">'+v60Header('LIGA JUVENTINO','Todas las herramientas','Todas las funciones de la Liga reunidas aquí, incluyendo las herramientas adicionales.')+
    '<div class="v60-tools-featured" aria-label="Accesos principales">'+
      '<button type="button" class="v60-tools-featured-card" data-route="teams"><span class="v60-tools-featured-icon">'+v60Icon('center')+'</span><span class="v60-tools-featured-copy"><b>Equipos</b><small>Ver equipos registrados</small></span><i>›</i></button>'+
      '<button type="button" class="v60-tools-featured-card" data-route="players"><span class="v60-tools-featured-icon">'+v60Icon('center')+'</span><span class="v60-tools-featured-copy"><b>Jugadores</b><small>Ver jugadores registrados</small></span><i>›</i></button>'+
      '<button type="button" class="v60-tools-featured-card" data-route="bracketBuilder"><span class="v60-tools-featured-icon">'+v60Icon('bracket')+'</span><span class="v60-tools-featured-copy"><b>Liguilla</b><small>Cuadro eliminatorio</small></span><i>›</i></button>'+
      '<button type="button" class="v60-tools-featured-card" data-route="news"><span class="v60-tools-featured-icon">'+v60Icon('share')+'</span><span class="v60-tools-featured-copy"><b>Avisos</b><small>Noticias y comunicados</small></span><i>›</i></button>'+
    '</div>'+
    '<div class="v60-tools-all-label"><span>TODAS LAS FUNCIONES</span><b>Herramientas</b></div>'+
    '<div class="v60-tool-grid">'+
      v60ToolCard('search','Buscador','Equipos, jugadores, partidos, campos y noticias','search')+
      v60ToolCard('qr','QR de la Liga','Compartir acceso directo a la app','ligaQR')+
      v60ToolCard('center','Equipos registrados','Solo equipos oficiales sincronizados','teams')+
      v60ToolCard('center','Jugadores registrados','Plantillas oficiales de AdminFut','players', 'data-v60-all-players="1"')+
      v60ToolCard('cedula','Cédulas','Consulta y plantillas de partido','cedulas')+
      v60ToolCard('cedula','Generar cédula','Cédula y plantillas del partido','cedulaBuilder')+
      v60ToolCard('card','Generar credencial','Foto, OCR y credencial del jugador','credentialBuilder')+
      v60ToolCard('matchday','Match Day','Checklist y operación de jornada','matchday')+
      v60ToolCard('rules','Reglamento','Reglamento oficial 2026–2027','rulebook')+
      v60ToolCard('field','Dónde se juega','Campos, comunidades y Maps','venues')+
      v60ToolCard('center','Match Center','Partido oficial, marcador y cronología','v4-matchcenter')+
      v60ToolCard('matchday','Jornadas','Calendario y resultados','', 'data-v60-comp="fixtures"')+
      v60ToolCard('bracket','Liguilla','Cuadro de eliminatorias','', 'data-v60-comp="bracket"')+
      v60ToolCard('share','Publicaciones','Compartir jornada / WhatsApp','publications')+
      v60ToolCard('tactics','Tácticas','Pizarra 2D y formaciones','tactics')+
      v60ToolCard('sim','Simulador','Simulación local de clasificación','simulator')+
      v60ToolCard('admin','JR Control','Centro operativo de la Liga','jrControl')+
      v60ToolCard('center','Tabla y estadísticas','Tabla, goleadores y rendimiento','v38Stats')+
      v60ToolCard('share','Noticias y avisos','Avisos, junta semanal y multimedia','v38Weekly')+
      v60ToolCard('weather','Clima y estado oficial','Pronóstico, terreno y decisión oficial','v38Weather')+
      v60ToolCard('matchday','Partidos y jornadas','Todos, jugados, próximos y calendario','', 'data-v63-official="fixtures"')+
      v60ToolCard('center','Notificaciones','Próxima jornada, cambios de sede y favoritos','v38Alerts')+
      v60ToolCard('admin','Central oficial','Categorías, equipos, jugadores, tarjetas y castigos','', 'data-v63-official="summary"')+
      v60ToolCard('bracket','Cuadro PNG','8 lugares y exportación para liguilla','bracketBuilder')+
      v60ToolCard('center','Exportar tabla','PNG completo, compartir y CSV','tableExport')+
      v60ToolCard('matchday','Preparar mi jornada','Agenda local, cruces y JSON','agendaBuilder')+
      v60ToolCard('tactics','Jornada animada','Balones en movimiento y accesos','motionHub')+
      v60ToolCard('share','Aviso de suspensión','Borrador y vista previa de jornada suspendida','suspensionTool')+
    '</div></section>';
}
let v60RulebookDoc=null,v60RulebookPage=1,v60RulebookRenderToken=0;
function v60LoadPdfJs(){
  if(window.pdfjsLib)return Promise.resolve(window.pdfjsLib);
  if(window.__v60PdfJsPromise)return window.__v60PdfJsPromise;
  window.__v60PdfJsPromise=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
    s.onload=()=>window.pdfjsLib?resolve(window.pdfjsLib):reject(new Error('PDF.js no disponible'));
    s.onerror=()=>reject(new Error('No se pudo cargar PDF.js'));
    document.head.appendChild(s);
  });
  return window.__v60PdfJsPromise;
}
async function v60RenderRulebookPage(pageNo){
  const host=document.querySelector('[data-v60-pdf-preview]');
  if(!host)return;
  const canvas=host.querySelector('[data-v60-pdf-canvas]');
  const loading=host.querySelector('[data-v60-pdf-loading]');
  const pageText=host.querySelector('[data-v60-pdf-page]');
  const prev=host.querySelector('[data-v60-pdf-prev]');
  const next=host.querySelector('[data-v60-pdf-next]');
  const token=++v60RulebookRenderToken;
  try{
    if(loading){loading.hidden=false;loading.textContent='Cargando reglamento…'}
    const pdfjs=await v60LoadPdfJs();
    pdfjs.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    if(!v60RulebookDoc){
      v60RulebookDoc=await pdfjs.getDocument({url:V60_RULEBOOK}).promise;
    }
    if(token!==v60RulebookRenderToken||!document.querySelector('[data-v60-pdf-preview]'))return;
    v60RulebookPage=Math.max(1,Math.min(v60RulebookDoc.numPages,Number(pageNo)||1));
    const page=await v60RulebookDoc.getPage(v60RulebookPage);
    const base=page.getViewport({scale:1});
    const available=Math.max(280,Math.min(host.clientWidth-20,720));
    const scale=Math.min(2.2,available/base.width);
    const viewport=page.getViewport({scale});
    const dpr=Math.min(window.devicePixelRatio||1,2);
    canvas.width=Math.floor(viewport.width*dpr);
    canvas.height=Math.floor(viewport.height*dpr);
    canvas.style.width=Math.floor(viewport.width)+'px';
    canvas.style.height=Math.floor(viewport.height)+'px';
    const ctx=canvas.getContext('2d',{alpha:false});
    ctx.setTransform(dpr,0,0,dpr,0,0);
    await page.render({canvasContext:ctx,viewport}).promise;
    canvas.hidden=false;
    if(loading)loading.hidden=true;
    if(pageText)pageText.textContent='Página '+v60RulebookPage+' de '+v60RulebookDoc.numPages;
    if(prev)prev.disabled=v60RulebookPage<=1;
    if(next)next.disabled=v60RulebookPage>=v60RulebookDoc.numPages;
  }catch(err){
    if(loading){
      loading.hidden=false;
      loading.innerHTML='<b>No se pudo cargar la vista previa.</b><span>El PDF sigue disponible con “Abrir PDF”.</span>';
    }
    if(canvas)canvas.hidden=true;
    if(pageText)pageText.textContent='Reglamento oficial';
  }
}
function rulebookView(){
  const viewer='https://docs.google.com/gview?embedded=1&url='+encodeURIComponent(V60_RULEBOOK_PUBLIC);
  return '<section class="v60-tool-page">'+v60Header('DOCUMENTOS','Reglamento','Consulta el Reglamento oficial de la Liga Municipal de Fútbol Juventino Rosas 2026–2027.')+
    '<div class="v60-panel"><div class="v60-actions"><a class="v60-link" href="'+V60_RULEBOOK+'" target="_blank" rel="noopener noreferrer">Abrir PDF</a><a class="v60-link outline" href="'+V60_RULEBOOK+'" download="Reglamento_Liga_Juventino_Rosas_2026_2027.pdf">Descargar</a></div><p class="v60-note">El reglamento se muestra aquí mismo con una vista previa y también puedes abrirlo o descargarlo completo.</p></div>'+
    '<div class="v60-pdf-shell v60-pdf-reader v72-rulebook-preview" data-v60-pdf-preview>'+
      '<div class="v72-preview-head"><span>VISTA PREVIA DEL PDF</span><strong>Reglamento oficial</strong></div>'+
      '<div class="v72-preview-frame-wrap">'+
        '<iframe class="v72-preview-frame" src="'+viewer+'" title="Vista previa del Reglamento oficial" loading="eager" allow="fullscreen" referrerpolicy="no-referrer-when-downgrade"></iframe>'+
        '<div class="v72-preview-fallback"><b>Vista previa del reglamento</b><span>Si el visor tarda en cargar, usa “Abrir PDF”.</span><a class="v60-link" href="'+V60_RULEBOOK+'" target="_blank" rel="noopener noreferrer">Abrir PDF</a></div>'+
      '</div>'+
    '</div>'+
    '<div class="v60-actions v63-rulebook-tools"><button class="v60-btn outline" data-route="leagueTools">Todas las funciones de la Liga</button></div></section>';
}
function v60MatchdayState(){try{return JSON.parse(localStorage.getItem('v60-matchday')||'{}')||{}}catch(e){return {}}}
function matchdayView(){
  const s=v60MatchdayState();
  const checks=[
    ['calendar','Calendario revisado','Fecha, hora y categoría verificadas.'],
    ['fields','Campos confirmados','Sede revisada antes de publicar.'],
    ['refs','Árbitros / responsables','Asignación confirmada para la jornada.'],
    ['lineups','Alineaciones','Plantillas listas para Match Center.'],
    ['results','Resultados','Marcadores capturados y revisados.'],
    ['report','Reporte de jornada','Cédulas, incidencias y cierre preparados.']
  ];
  return '<section class="v60-tool-page">'+v60Header('OPERACIÓN','Match Day','Centro de jornada local. El checklist se guarda únicamente en este dispositivo.')+
    '<div class="v60-panel"><div class="v60-checklist">'+checks.map(x=>'<label class="v60-check"><input type="checkbox" data-v60-check="'+x[0]+'" '+(s[x[0]]?'checked':'')+'><span><b>'+x[1]+'</b><small>'+x[2]+'</small></span></label>').join('')+'</div>'+
    '<textarea class="v60-textarea" data-v60-matchday-note placeholder="Notas de jornada">'+(s.note||'')+'</textarea>'+
    '<div class="v60-actions"><button class="v60-btn" data-v60-comp="fixtures">Ver jornada</button><button class="v60-btn outline" data-route="venues">Campos</button><button class="v60-btn outline" data-route="cedulas">Cédulas</button></div></div>'+
    '<section class="v60-tool-section"><h2>Partidos</h2><div class="v60-panel">'+matches.slice(0,5).map(m=>'<div class="v60-row"><span class="v60-row-copy"><b>'+team(m.home).name+' vs '+team(m.away).name+'</b><small>'+m.day+' · '+m.time+' · '+m.venue+'</small></span><button class="v60-btn ghost" data-match="'+m.id+'">Abrir</button></div>').join('')+'</div></section></section>';
}
function weatherFieldsView(){
  return '<section class="v60-tool-page">'+v60Header('SEDES','Clima y campos','Consulta condiciones meteorológicas por las sedes que tienen referencia geográfica disponible.')+
    '<p class="v60-note">El clima es informativo. No marca un partido como suspendido o cancelado automáticamente.</p>'+
    '<div class="v60-field-list" style="margin-top:14px">'+V60_FIELDS.map(f=>'<article class="v60-field-card">'+v60FieldPreview(f,'v60-field-preview-card')+'<div class="v60-field-top"><h3>'+f.name+'</h3><span>'+f.community+'</span></div><p>'+f.address+'</p><div class="v60-actions">'+(f.weather?'<button class="v60-btn" data-v60-weather="'+f.id+'">Ver clima</button>':v60HasExactMap(f)?'<a class="v60-link" href="'+v60MapUrl(f)+'" target="_blank" rel="noopener">Ver ubicación</a>':'<button class="v60-btn ghost" disabled>Pin pendiente</button>')+'<a class="v60-link outline" href="'+v60MapUrl(f)+'" target="_blank" rel="noopener">Mapa</a></div><div class="v60-weather-result" data-v60-weather-result="'+f.id+'" hidden></div></article>').join('')+'</div></section>';
}
function v60VenuesView(){
  return '<section class="v60-tool-page">'+v60Header('SEDES','Dónde se juega','Campos y comunidades de la Liga con acceso directo a su ubicación.')+
    '<div class="v60-field-list">'+V60_FIELDS.map(f=>'<article class="v60-field-card">'+v60FieldPreview(f,'v60-field-preview-card')+'<div class="v60-field-top"><h3>'+f.name+'</h3><span>'+f.community+'</span></div><p>'+f.address+'</p><div class="v60-actions"><a class="v60-link" href="'+v60MapUrl(f)+'" target="_blank" rel="noopener">Abrir en Maps</a>'+(f.weather?'<button class="v60-btn outline" data-route="weatherFields">Clima</button>':'')+'</div></article>').join('')+'</div></section>';
}
function cedulasView(){
  return '<section class="v60-tool-page">'+v60Header('PARTIDOS','Cédulas','Genera y consulta una cédula deportiva dentro de la aplicación.')+
    '<div class="v60-panel">'+matches.map(m=>'<div class="v60-row"><span class="v60-row-copy"><b>'+team(m.home).name+' vs '+team(m.away).name+'</b><small>'+m.category+' · Jornada '+m.jornada+' · '+m.day+' '+m.time+'</small></span><button class="v60-btn ghost" data-v60-cedula="'+m.id+'">Cédula</button></div>').join('')+'</div>'+
    '<p class="v60-note">La cédula pública muestra únicamente información deportiva; no publica CURP, INE, domicilio ni documentos privados.</p></section>';
}
function v60OfficialFixtureCrest(name){
  const label=String(name||'Equipo').trim();
  const src=window.LJR_TEAM_LOGOS?.get?.(label)||window.V66_OFFICIAL_DIRECTORY?.logoFor?.(label)||'';
  const fallback=label.split(/\s+/).filter(Boolean).slice(0,2).map(x=>x[0]||'').join('').toUpperCase()||'JR';
  return src
    ?'<span class="crest"><img src="'+v64Esc(src)+'" alt="'+v64Esc(label)+'" style="width:100%;height:100%;object-fit:contain;border-radius:50%" loading="eager" decoding="async"></span>'
    :'<span class="crest">'+v64Esc(fallback)+'</span>';
}
function cedulaDetailView(){
  const official=localStorage.getItem('v66-cedula-source')==='official-directory';
  if(official){
    const home=localStorage.getItem('v66-cedula-home')||'Equipo local';
    const away=localStorage.getItem('v66-cedula-away')||'Equipo visitante';
    const category=localStorage.getItem('v66-cedula-cat')||'Por confirmar';
    const date=localStorage.getItem('v66-cedula-date')||'Por confirmar';
    const field=localStorage.getItem('v66-cedula-field')||'Por confirmar';
    const round=localStorage.getItem('v66-cedula-round')||'—';
    return '<section class="v60-tool-page">'+v60Header('CÉDULA OFICIAL','Partido','Consulta interna del partido seleccionado. Lista para imprimir o guardar como PDF.')+
      '<article class="v60-cedula"><div class="v60-cedula-head"><b>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</b><span>J'+v64Esc(round)+'</span></div>'+
        '<div class="v60-versus"><div>'+v60OfficialFixtureCrest(home)+'<strong>'+v64Esc(home)+'</strong></div><span>VS</span><div>'+v60OfficialFixtureCrest(away)+'<strong>'+v64Esc(away)+'</strong></div></div>'+
        '<div class="v60-cedula-meta"><div><small>Categoría</small><b>'+v64Esc(category)+'</b></div><div><small>Fecha / hora</small><b>'+v64Esc(date)+'</b></div><div><small>Campo</small><b>'+v64Esc(field)+'</b></div><div><small>Árbitro</small><b>Por asignar</b></div></div>'+
      '</article>'+
      '<div class="v60-actions"><button class="v60-btn" data-v60-print>Imprimir / PDF</button><button class="v60-btn outline" data-route="cedulaBuilder">Abrir generador</button><button class="v60-btn ghost" data-route="cedulas">Volver a cédulas</button></div></section>';
  }
  const m=matches.find(x=>x.id===state.selectedMatch)||matches[0];
  return '<section class="v60-tool-page">'+v60Header('CÉDULA OFICIAL','Partido','Vista interna preparada para imprimir o guardar como PDF.')+
    '<article class="v60-cedula"><div class="v60-cedula-head"><b>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</b><span>J'+m.jornada+'</span></div>'+
      '<div class="v60-versus"><div>'+crest(m.home)+'<strong>'+team(m.home).name+'</strong></div><span>VS</span><div>'+crest(m.away)+'<strong>'+team(m.away).name+'</strong></div></div>'+
      '<div class="v60-cedula-meta"><div><small>Categoría</small><b>'+m.category+'</b></div><div><small>Fecha</small><b>'+m.day+' · '+m.time+'</b></div><div><small>Campo</small><b>'+m.venue+'</b></div><div><small>Árbitro</small><b>'+m.referee+'</b></div></div>'+
    '</article><div class="v60-actions"><button class="v60-btn" data-v60-print>Imprimir / PDF</button><button class="v60-btn outline" data-route="cedulas">Volver a cédulas</button></div></section>';
}
function credentialView(){
  const p=player(state.selectedPlayer||players[0]?.id)||players[0],t=team(p.team);
  return '<section class="v60-tool-page">'+v60Header('IDENTIDAD DEPORTIVA','Credencial','Credencial pública del jugador dentro de la Liga.')+
    '<article class="v60-credential"><div class="v60-cred-head"><div class="v60-cred-avatar">'+p.number+'</div><div><h2>'+p.name+'</h2><p>'+t.name+' · '+p.position+'</p><span class="v60-cred-status">HABILITADO</span></div></div>'+
    '<div class="v60-cred-grid"><div><small>Equipo</small><b>'+t.name+'</b></div><div><small>Categoría</small><b>'+t.category+'</b></div><div><small>Número</small><b>'+p.number+'</b></div><div><small>Posición</small><b>'+p.position+'</b></div><div><small>Temporada</small><b>2026–2027</b></div><div><small>Liga</small><b>Juventino Rosas</b></div></div></article>'+
    '<div class="v60-actions"><button class="v60-btn" data-v60-print>Imprimir / PDF</button><button class="v60-btn outline" data-route="players">Elegir jugador</button></div></section>';
}
function v95BulletinText(kind){
  const list=matches.slice(0,8);
  const first=list[0];
  const league='Liga Municipal de Fútbol Juventino Rosas';
  const jornada=first?.jornada?'Jornada '+first.jornada:'Próxima jornada';
  const category=first?.category||'';
  const rows=list.map(m=>team(m.home).name+' vs '+team(m.away).name+' · '+m.day+' '+m.time+' · '+m.venue);

  if(kind==='short'){
    return '⚽ '+jornada+(category?' · '+category:'')+'\\n'+
      rows.map(x=>'• '+x).join('\\n')+
      '\\nConsulta la app de la Liga para ver detalles.';
  }
  if(kind==='fields'){
    return '📍 HORARIOS Y CAMPOS · '+jornada+'\\n'+
      list.map(m=>'• '+m.time+' · '+team(m.home).name+' vs '+team(m.away).name+' · '+m.venue).join('\\n')+
      '\\n'+league;
  }
  if(kind==='featured'){
    const m=first;
    if(!m)return league+'\\nPróxima jornada';
    return '🔥 PARTIDO DESTACADO\\n'+
      team(m.home).name+' vs '+team(m.away).name+'\\n'+
      (m.day||'')+' · '+(m.time||'')+' · '+(m.venue||'Campo por confirmar')+
      '\\n'+(m.category||'')+' · Jornada '+(m.jornada||'')+
      '\\n'+league;
  }
  if(kind==='reminder'){
    return '📣 RECORDATORIO DE JORNADA\\n'+
      'Mañana se juega '+jornada.toLowerCase()+(category?' de '+category:'')+'.\\n'+
      rows.map(x=>'• '+x).join('\\n')+
      '\\nRevisa horarios y sedes antes de salir.\\n'+league;
  }
  return league+'\\n'+jornada+(category?' · '+category:'')+'\\n'+rows.join('\\n');
}

function publicationsView(){
  const selected=localStorage.getItem('v95-bulletin-kind')||'full';
  const text=v95BulletinText(selected);
  const options=[
    ['full','Jornada completa'],
    ['short','WhatsApp corto'],
    ['fields','Horarios y campos'],
    ['featured','Partido destacado'],
    ['reminder','Recordatorio']
  ];
  return '<section class="v60-tool-page">'+v60Header('COMUNICACIÓN','Publicaciones','Genera boletines rápidos y copia el texto con un toque.')+
    '<article class="v95-ai-bulletins">'+
      '<div class="v95-ai-head"><span>IA RÁPIDA</span><b>Boletines automáticos</b><small>Usa los partidos cargados en la app y no inventa resultados.</small></div>'+
      '<div class="v95-bulletin-types">'+options.map(x=>'<button type="button" class="'+(selected===x[0]?'active':'')+'" data-v95-bulletin-kind="'+x[0]+'">'+x[1]+'</button>').join('')+'</div>'+
      '<div class="v95-quick-copy">'+
        '<button type="button" data-v95-copy-kind="short">Copiar corto</button>'+
        '<button type="button" data-v95-copy-kind="fields">Copiar horarios</button>'+
        '<button type="button" data-v95-copy-kind="reminder">Copiar recordatorio</button>'+
      '</div>'+
    '</article>'+
    '<article class="v60-share-card"><h2>Boletín listo</h2><p>Selecciona un estilo arriba. El texto se actualiza al instante.</p><div class="v60-share-preview" data-v60-share-text>'+v64Esc(text)+'</div><div class="v60-actions"><button class="v60-btn" data-v60-share>Compartir</button><button class="v60-btn outline" data-v60-copy>Copiar texto</button></div></article>'+
    '<p class="v60-note">En móvil puedes compartir directo a WhatsApp. Los boletines se forman con los partidos cargados en la app para evitar datos inventados.</p></section>';
}
function v60Formation(){return localStorage.getItem('v60-formation')||'2-3-1'}
function v60PitchPlayers(form){
  const layouts={
    '2-3-1':[[50,90],[25,72],[75,72],[20,48],[50,48],[80,48],[50,20]],
    '3-2-1':[[50,90],[20,70],[50,70],[80,70],[34,45],[66,45],[50,20]],
    '2-2-2':[[50,90],[28,69],[72,69],[33,46],[67,46],[34,20],[66,20]]
  };
  return (layouts[form]||layouts['2-3-1']).map((p,i)=>'<span class="v60-player-dot" style="left:calc('+p[0]+'% - 21px);top:calc('+p[1]+'% - 21px)">'+(i+1)+'</span>').join('');
}
function tacticsView(){
  const form=v60Formation();
  return '<section class="v60-tool-page">'+v60Header('PIZARRA','Tácticas','Cambia la formación y prepara una estructura rápida dentro de la app.')+
    '<div class="v60-formations">'+['2-3-1','3-2-1','2-2-2'].map(x=>'<button class="'+(x===form?'active':'')+'" data-v60-formation="'+x+'">'+x+'</button>').join('')+'</div>'+
    '<div class="v60-pitch">'+v60PitchPlayers(form)+'</div><p class="v60-note">La pizarra es una herramienta de planificación; no modifica alineaciones oficiales ni resultados.</p></section>';
}
function v60SimState(){try{return JSON.parse(localStorage.getItem('v60-sim')||'{}')||{}}catch(e){return {}}}
function simulatorView(){
  const s=v60SimState(),rows=teams.map(t=>({t,pts:t.pts+(s[t.code]||0)})).sort((a,b)=>b.pts-a.pts);
  return '<section class="v60-tool-page">'+v60Header('ESCENARIOS','Simulador','Prueba escenarios de puntos sin alterar la tabla oficial.')+
    '<div class="v60-sim-table">'+rows.map((r,i)=>'<div class="v60-sim-row"><b>'+(i+1)+'</b><span class="v60-sim-team">'+crest(r.t.code)+'<b>'+r.t.name+'</b></span><b class="v60-sim-pts">'+r.pts+'</b><span class="v60-sim-actions"><button data-v60-sim="'+r.t.code+'" data-delta="-3">−3</button><button data-v60-sim="'+r.t.code+'" data-delta="3">+3</button></span></div>').join('')+'</div>'+
    '<div class="v60-actions"><button class="v60-btn outline" data-v60-sim-reset>Reiniciar simulación</button><button class="v60-btn ghost" data-v60-comp="standings">Ver tabla oficial</button></div><p class="v60-note">Los cambios se guardan localmente y son hipotéticos.</p></section>';
}
function jrControlView(){
  return '<section class="v60-tool-page">'+v60Header('OPERACIÓN','JR Control','Accesos operativos integrados sin sacar al usuario del diseño azul.')+
    '<div class="v60-tool-grid">'+
      v60ToolCard('matchday','Centro de jornada','Checklist, partidos y cierre','matchday')+
      v60ToolCard('cedula','Cédulas','Generación interna, plantillas y PDF','cedulaBuilder')+
      v60ToolCard('weather','Clima / campos','Condiciones y sedes','weatherFields')+
      v60ToolCard('share','Publicaciones','Compartir jornada','publications')+
      v60ToolCard('field','Equipos','Directorio de clubes','teams')+
      v60ToolCard('card','Jugadores','Plantillas deportivas','players')+
    '</div><p class="v60-note">Este centro público no expone documentos privados. Las tareas administrativas sensibles requieren un backend/autenticación antes de habilitarse.</p></section>';
}


function v63FeatureCard(icon,kicker,title,desc,route,extra=''){
  const attrs=route?'data-route="'+route+'"':extra;
  return '<button type="button" class="v63-feature-card" '+attrs+'>'+
    '<span class="v63-feature-icon">'+v60Icon(icon)+'</span>'+
    '<span class="v63-feature-copy"><small>'+kicker+'</small><b>'+title+'</b><em>'+desc+'</em></span>'+
    '<span class="v63-feature-arrow">›</span></button>';
}
function v38StatsView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('TABLA Y ESTADÍSTICAS','La temporada, de un vistazo','Posiciones, goleadores y rendimiento con accesos rápidos dentro del diseño actual de la app.')+
    '<div class="v63-action-grid">'+
      '<button class="v60-btn" data-v63-comp="standings">Tabla</button>'+
      '<button class="v60-btn outline" data-route="scorers">Goleadores</button>'+
      '<button class="v60-btn outline" data-safe-route="safe-performance">Rendimiento</button>'+
    '</div>'+
    '<div class="v60-panel"><p class="v60-note">Estos accesos reutilizan las pantallas existentes; no sustituyen la navegación ni cambian el diseño principal.</p></div>'+
  '</section>';
}
function v38WeeklyView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('LO IMPORTANTE DE LA SEMANA','Noticias y avisos','Accesos adaptados para comunicados, junta de liga y contenido multimedia.')+
    '<div class="v63-feature-list">'+
      v63FeatureCard('share','AVISO','Cambios de horario y sedes','Comunicados y novedades publicadas para equipos y afición.','notices')+
      v63FeatureCard('matchday','JUNTA','Junta semanal de liga','Checklist, acuerdos y operación de jornada en un solo espacio.','matchday')+
      v63FeatureCard('center','MULTIMEDIA','Semifinales, finales y momentos','Videos y momentos destacados dentro de la app.','moments')+
    '</div>'+
  '</section>';
}
function v38WeatherView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('CENTRAL OPERATIVA','Clima ≠ terreno ≠ decisión oficial','El pronóstico es informativo. La decisión oficial de un partido se consulta por separado.')+
    '<div class="v63-feature-list">'+
      v63FeatureCard('weather','PRONÓSTICO','Referencia meteorológica','Consulta clima por sede cuando existen coordenadas verificadas.','weatherFields')+
      v63FeatureCard('field','ESTADO DEL TERRENO','Consulta los campos','Revisa sede, comunidad, mapa y condiciones disponibles.','venues')+
      v63FeatureCard('center','DECISIÓN OFICIAL','Consulta partidos y resultados','El estado deportivo se mantiene separado del pronóstico meteorológico.','competition')+
    '</div>'+
    '<p class="v60-note">La lluvia por sí sola no marca un partido como suspendido. La Liga conserva la decisión oficial.</p>'+
  '</section>';
}
function v38AlertsView(){
  return '<section class="v60-tool-page v63-page">'+
    v60Header('CENTRO DE AVISOS','Notificaciones','Accesos para próxima jornada, cambios de sede y seguimiento de favoritos.')+
    '<div class="v63-feature-list">'+
      v63FeatureCard('matchday','PRÓXIMA JORNADA','Avisos de jornada','Configura tus preferencias de notificaciones.','notifications')+
      v63FeatureCard('field','CAMBIO DE SEDE','Campos y ubicaciones','Revisa cambios relevantes de cancha o sede.','venues')+
      v63FeatureCard('center','PARTIDO FAVORITO','Equipos y encuentros destacados','Consulta tus favoritos y equipos seguidos.','favorites')+
    '</div>'+
    '<div class="v60-actions"><button class="v60-btn outline" data-route="following">Equipos que sigues</button></div>'+
  '</section>';
}

function v64Esc(v){return String(v??'').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}

function v64TeamNames(){
  const out=[];
  const add=function(n){n=String(n||'').trim();if(n&&!out.some(function(x){return x.toLowerCase()===n.toLowerCase()}))out.push(n)};
  try{
    const db=window.LJR_OFFICIAL_DATA||{};
    Object.values(db.categories||{}).forEach(function(cat){
      Object.keys(cat.rosters||{}).forEach(add);
      ((cat.standings||[])[0]?.rows||[]).forEach(function(r){add(r[1])});
      ((cat.fixtures||[])[0]?.rows||[]).forEach(function(r){add(r[2]);add(r[6])});
    });
  }catch(e){}
  if(!out.length){
    ['TOROS DE CUENDA','MANCHESTER','BOAVISTA','DYNAMO','LA ESPERANZA','BOCA JRS',
     'FRANCO FC','HERMANOS','NAPOLI','HERRERAS FC','LINCES','ABEJAS','LOBOS CDG','JUVENTUS','SAN JOSE FC','TERRICOLAS','GALACTICOS',
     'DEP. ZAPATA','SAN JULIAN','BARZA','SAN JUAN FC','CELTICOS','SAN JOSE JRS','DEP. NOPALERO','TAPATIO','DEP. LA LUZ','PACHANGAS FC','SAN ANTONIO FC','TAVERA FC',
     'CAPIBARAS','MAZACOTES FC','LA HUERTA','LA CANCHITA DEPORTES','POPULARES','MALVINAS','PROMESAS FC','LA CUADRILLA','DEP. MARAVILLAS','GALEANA','SAN ANTONIO JRS','OSASUNA','ALDAMA FC'
    ].forEach(add);
  }
  return out;
}

function v64TeamCategory(name){
  const target=String(name||'').trim().toLowerCase();if(!target)return '';
  try{
    const db=window.LJR_OFFICIAL_DATA||{};
    for(const cat of Object.values(db.categories||{})){
      const hit=Object.keys(cat.rosters||{}).find(n=>String(n).trim().toLowerCase()===target)||
        (((cat.standings||[])[0]?.rows||[]).find(r=>String(r?.[1]||'').trim().toLowerCase()===target)||[])[1];
      if(hit)return cat.name||'';
    }
  }catch(e){}
  return '';
}
function v64TeamSelect(name,attr){
  const list=v64TeamNames(),selected=String(name||'').trim().toLowerCase();
  return '<select '+attr+'><option value="">Por confirmar</option>'+list.map(function(n){
    const cat=v64TeamCategory(n);
    return '<option data-category="'+v64Esc(cat)+'" '+(n.toLowerCase()===selected?'selected':'')+'>'+v64Esc(n)+'</option>';
  }).join('')+'</select>';
}
function v64SyncCredentialTeamCategory(){
  const team=document.querySelector('[data-v64-cred-team]'),cat=document.querySelector('[data-v64-cred-cat]'),label=document.querySelector('[data-v64-auto-category]');
  const value=team?.selectedOptions?.[0]?.dataset?.category||v64TeamCategory(team?.value||'');
  if(cat)cat.value=value||'Por confirmar';
  if(label)label.textContent=value||'Por confirmar';
  return value;
}

function v64StandingsRows(){
  try{
    const db=window.LJR_OFFICIAL_DATA||{};
    const id=localStorage.getItem('v62-category')||'3';
    const cat=(db.categories||{})[id];
    const rows=((cat?.standings||[])[0]?.rows||[]);
    if(rows.length)return rows.map(function(r,i){return {pos:r[0]||i+1,name:r[1]||'',pj:r[2]||'',dg:r[8]||'',pts:r[9]||''}});
  }catch(e){}
  return teams.slice().sort(function(a,b){return b.pts-a.pts}).map(function(t,i){return {pos:i+1,name:t.name,pj:t.p,dg:t.gd,pts:t.pts}});
}

function v64Download(blob,name){
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(url)},1200);
}

function v64CanvasTable(){
  const rows=v64StandingsRows(),w=1200,rowH=86,h=190+rows.length*rowH,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const x=canvas.getContext('2d');x.fillStyle='#07105d';x.fillRect(0,0,w,h);x.fillStyle='#19e1f2';x.font='700 28px Arial';x.fillText('LIGA JUVENTINO ROSAS',58,58);
  x.fillStyle='#fff';x.font='800 52px Arial';x.fillText('TABLA DE POSICIONES',58,120);
  x.font='700 25px Arial';x.fillStyle='#aeb4d2';x.fillText('#',58,168);x.fillText('EQUIPO',140,168);x.fillText('PJ',820,168);x.fillText('DG',930,168);x.fillText('PTS',1045,168);
  rows.forEach(function(r,i){const y=190+i*rowH;x.fillStyle=i%2?'#0b0c70':'#10117d';x.fillRect(42,y,w-84,rowH-8);x.fillStyle='#fff';x.font='700 28px Arial';x.fillText(String(r.pos),62,y+52);x.fillText(String(r.name).slice(0,34),140,y+52);x.fillText(String(r.pj),825,y+52);x.fillText(String(r.dg),935,y+52);x.fillStyle='#19e1f2';x.fillText(String(r.pts),1050,y+52)});
  return new Promise(function(resolve){canvas.toBlob(function(b){resolve(b)},'image/png',1)});
}

function v64CanvasBracket(){
  const sels=[...document.querySelectorAll('[data-v64-place]')].map(function(s){return s.value||'Por confirmar'}),w=1200,h=900,canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
  const x=canvas.getContext('2d');x.fillStyle='#07105d';x.fillRect(0,0,w,h);x.fillStyle='#19e1f2';x.font='700 28px Arial';x.fillText('LIGA JUVENTINO ROSAS',55,58);x.fillStyle='#fff';x.font='800 50px Arial';x.fillText('CUADRO FINAL · 8 LUGARES',55,120);
  const pairs=[[0,7],[3,4],[1,6],[2,5]],ys=[210,370,530,690];
  pairs.forEach(function(p,k){const y=ys[k];x.fillStyle='#12137a';x.fillRect(70,y,420,112);x.fillStyle='#fff';x.font='700 25px Arial';x.fillText((p[0]+1)+'. '+sels[p[0]].slice(0,25),92,y+43);x.fillText((p[1]+1)+'. '+sels[p[1]].slice(0,25),92,y+86);x.strokeStyle='#19e1f2';x.lineWidth=3;x.beginPath();x.moveTo(490,y+56);x.lineTo(590,y+56);x.stroke()});
  x.fillStyle='#111274';x.fillRect(590,290,260,130);x.fillRect(590,610,260,130);x.fillStyle='#fff';x.font='700 25px Arial';x.fillText('SEMIFINAL 1',620,350);x.fillText('SEMIFINAL 2',620,670);
  x.strokeStyle='#19e1f2';x.beginPath();x.moveTo(850,355);x.lineTo(930,355);x.lineTo(930,515);x.lineTo(990,515);x.moveTo(850,675);x.lineTo(930,675);x.lineTo(930,515);x.stroke();
  x.fillStyle='#0b2c91';x.fillRect(990,455,170,120);x.fillStyle='#19e1f2';x.font='800 30px Arial';x.fillText('FINAL',1035,525);
  return new Promise(function(resolve){canvas.toBlob(function(b){resolve(b)},'image/png',1)});
}

function v64ExportTableView(){
  const rows=v64StandingsRows();
  return '<section class="v60-tool-page v64-page">'+v60Header('EXPORTAR','Tabla completa','Descarga o comparte la tabla desde la app sin cambiar su diseño.')+
    '<div class="v64-mini-table">'+rows.map(function(r){return '<div><b>'+v64Esc(r.pos)+'</b><span>'+v64Esc(r.name)+'</span><em>'+v64Esc(r.pts)+'</em></div>'}).join('')+'</div>'+
    '<div class="v64-stack-actions"><button class="v60-btn" data-v64-export-png>↓ Descargar PNG completo</button><button class="v60-btn outline" data-v64-share-png>Compartir PNG</button><button class="v60-btn outline" data-v64-export-csv>Descargar CSV</button></div></section>';
}

function v64BracketView(){
  return '<section class="v60-tool-page v64-page">'+v60Header('LIGUILLA','Generar cuadro PNG','Selecciona los ocho lugares y descarga un cuadro listo para compartir.')+
    '<div class="v64-form-grid">'+Array.from({length:8},function(_,i){return '<label><b>Lugar '+(i+1)+'</b>'+v64TeamSelect('', 'data-v64-place="'+(i+1)+'"')+'</label>'}).join('')+'</div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-bracket-png>Generar cuadro PNG</button></div></section>';
}

function v64CredentialBuilderView(){
  const v66Player=localStorage.getItem('v66-selected-player')||'',v66Team=localStorage.getItem('v66-selected-player-team')||'';
  return '<section class="v60-tool-page v64-page">'+v60Header('REGISTRO DE JUGADOR','Registro y credencial','Carga una foto del documento y una foto del jugador. Al detectar la INE o CURP se completan automáticamente nombre, CURP y fecha de nacimiento; revisa los datos antes de usarlos.')+
    '<div class="v64-form-grid one">'+
      '<label class="v64-upload-field"><b>Foto de CURP o INE</b><input type="file" accept="image/*" data-v64-doc><span class="v64-upload-mini v64-upload-doc" data-v64-doc-preview><span>Vista previa del documento</span></span></label>'+
      '<label class="v64-upload-field"><b>Foto del jugador</b><input type="file" accept="image/*" data-v64-photo><span class="v64-upload-mini v64-upload-player" data-v64-player-mini-preview><span>Vista previa de la foto</span></span></label>'+
      '<div class="v60-actions v64-ocr-one"><button class="v60-btn" data-v64-ocr>Detectar INE / CURP</button></div>'+
      '<label><b>Texto detectado — revisa y corrige</b><textarea class="v60-textarea" data-v64-ocr-text></textarea></label>'+
      '<label><b>Nombre del jugador</b><input type="text" data-v64-cred-name placeholder="Se completa al detectar texto" value="'+v64Esc(v66Player)+'"></label>'+
      '<label><b>CURP (detección automática local)</b><input type="text" maxlength="18" data-v64-cred-curp placeholder="Se completa al detectar texto" autocomplete="off"></label>'+
      '<label><b>Equipo</b>'+v64TeamSelect(v66Team, 'data-v64-cred-team')+'</label>'+
      '<input type="hidden" data-v64-cred-cat value="'+v64Esc(v64TeamCategory(v66Team)||'Por confirmar')+'">'+
      '<div class="v64-auto-category"><small>Categoría automática</small><b data-v64-auto-category>'+v64Esc(v64TeamCategory(v66Team)||'Por confirmar')+'</b></div>'+
    '</div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-download-credential-png>Descargar PNG</button><button class="v60-btn outline" data-v64-print-credential>Descargar PDF · 1 hoja</button></div></section>';
}

function v64CedulaBuilderView(){
  const v66Home=localStorage.getItem('v66-cedula-home')||'',v66Away=localStorage.getItem('v66-cedula-away')||'',v66Cat=localStorage.getItem('v66-cedula-cat')||'Primera Fuerza',v66Date=localStorage.getItem('v66-cedula-date')||'',v66Field=localStorage.getItem('v66-cedula-field')||'';
  const v66DateValue=/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(v66Date)?v66Date.slice(0,16):'';
  return '<section class="v60-tool-page v64-page">'+v60Header('CÉDULAS','Generador interno de cédulas','Genera una cédula y plantillas dentro de Liga Juventino Rosas; no redirige a una página externa.')+
    '<div class="v64-form-grid one">'+
      '<label><b>Categoría</b><select data-v64-ced-cat><option '+(v66Cat==='Primera Fuerza'?'selected':'')+'>Primera Fuerza</option><option '+(v66Cat==='Intermedia'?'selected':'')+'>Intermedia</option><option '+(v66Cat==='Segunda Fuerza'?'selected':'')+'>Segunda Fuerza</option><option '+(v66Cat==='Veteranos 35+'?'selected':'')+'>Veteranos 35+</option><option '+(v66Cat==='Veteranos 50+'?'selected':'')+'>Veteranos 50+</option></select></label>'+
      '<label><b>Equipo local</b>'+v64TeamSelect(v66Home, 'data-v64-ced-home')+'</label>'+
      '<label><b>Visitante</b>'+v64TeamSelect(v66Away, 'data-v64-ced-away')+'</label>'+
      '<label><b>Fecha</b><input type="datetime-local" value="'+v64Esc(v66DateValue)+'" data-v64-ced-date></label>'+
      '<label><b>Campo</b><input type="text" value="'+v64Esc(v66Field)+'" placeholder="Por confirmar" data-v64-ced-field></label>'+
      '<label><b>Árbitro</b><input type="text" placeholder="Por asignar" data-v64-ced-ref></label>'+
    '</div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-generate-cedula>Generar cédula del partido</button><button class="v60-btn outline" data-v64-team-template>Generar plantillas de equipos</button><button class="v60-btn ghost" data-v64-print-cedula>Imprimir / guardar PDF</button></div>'+
    '<div data-v64-cedula-preview></div></section>';
}

function v64AgendaView(){
  return '<section class="v60-tool-page v64-page">'+v60Header('JORNADA','Preparar mi jornada','Agenda y lista de revisión guardadas en este dispositivo. Son borradores y no modifican partidos ni resultados oficiales.')+
    '<div class="v64-form-grid one">'+
      '<label><b>Equipo local</b>'+v64TeamSelect('', 'data-v64-ag-home')+'</label>'+
      '<label><b>Equipo visitante</b>'+v64TeamSelect('', 'data-v64-ag-away')+'</label>'+
      '<label><b>Campo</b><input type="text" data-v64-ag-field placeholder="Campo"></label>'+
      '<label><b>Inicio · hora de Juventino Rosas</b><input type="datetime-local" data-v64-ag-start></label>'+
      '<label><b>Duración reservada (minutos)</b><input type="number" value="120" min="30" step="15" data-v64-ag-duration></label>'+
    '</div>'+
    '<div class="v64-stack-actions"><button class="v60-btn" data-v64-ag-add>Agregar y revisar cruces</button><button class="v60-btn outline" data-v64-ag-json>Exportar agenda JSON</button><button class="v60-btn ghost" data-v64-ag-clear>Limpiar agenda local</button></div>'+
    '<div class="v64-agenda-list" data-v64-agenda-list></div></section>';
}

function v64MotionView(){
  return '<section class="v60-tool-page v64-page v64-motion-page">'+v60Header('JORNADA','Fútbol en movimiento','Animación ligera adaptada a la app. Puedes pausarla cuando quieras.')+
    '<div class="v64-motion-tabs"><button data-v63-official="fixtures">JORNADA</button><button data-route="competition">RESULTADOS</button><button data-route="venues">CAMPOS</button></div>'+
    '<div class="v64-orbit-stage" data-v64-orbit><div class="v64-orbit one"><span>⚽</span></div><div class="v64-orbit two"><span>⚽</span></div><div class="v64-orbit-core">LIGA<br>JUVENTINO</div></div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-motion-toggle>Pausar movimiento</button><button class="v60-btn outline" data-v63-official="fixtures">Ver jornada</button></div></section>';
}

function v64SuspensionView(){
  let s={};try{s=JSON.parse(localStorage.getItem('v64-suspension-draft')||'{}')}catch(e){}
  return '<section class="v60-tool-page v64-page">'+v60Header('AVISO OFICIAL','Suspensión de jornada','Prepara un aviso local antes de publicarlo. No cambia automáticamente el estado oficial de los partidos.')+
    '<div class="v64-form-grid one"><label><b>Categoría</b><select data-v64-susp-cat><option '+(s.category==='Veteranos 50+'?'selected':'')+'>Veteranos 50+</option><option '+(s.category==='Veteranos 35+'?'selected':'')+'>Veteranos 35+</option><option '+(s.category==='Primera Fuerza'?'selected':'')+'>Primera Fuerza</option><option>Intermedia</option><option>Segunda Fuerza</option></select></label>'+
    '<label><b>Jornada</b><input type="number" min="1" value="'+v64Esc(s.jornada||6)+'" data-v64-susp-round></label></div>'+
    '<div class="v60-actions"><button class="v60-btn" data-v64-susp-preview>Vista previa del aviso</button><button class="v60-btn outline" data-v64-susp-save>Guardar borrador local</button></div>'+
    '<div data-v64-susp-modal></div></section>';
}

function v64RenderAgenda(){
  const host=document.querySelector('[data-v64-agenda-list]');if(!host)return;let list=[];try{list=JSON.parse(localStorage.getItem('v64-agenda')||'[]')}catch(e){}
  host.innerHTML=list.length?list.map(function(x,i){return '<article><b>'+v64Esc(x.home)+' vs '+v64Esc(x.away)+'</b><small>'+v64Esc(x.start||'Sin hora')+' · '+v64Esc(x.field||'Campo por confirmar')+' · '+v64Esc(x.duration)+' min</small><button data-v64-ag-remove="'+i+'">Quitar</button></article>'}).join(''):'<p class="v60-note">Todavía no hay cruces guardados.</p>';
  host.querySelectorAll('[data-v64-ag-remove]').forEach(function(b){b.onclick=function(){list.splice(Number(b.dataset.v64AgRemove),1);localStorage.setItem('v64-agenda',JSON.stringify(list));v64RenderAgenda()}});
}

function v64CredentialSync(){
  const autoCat=v64SyncCredentialTeamCategory();
  const name=document.querySelector('[data-v64-cred-name]')?.value||'Jugador',teamName=document.querySelector('[data-v64-cred-team]')?.value||'Equipo',cat=autoCat||document.querySelector('[data-v64-cred-cat]')?.value||'Categoría',curp=document.querySelector('[data-v64-cred-curp]')?.value||'';
  const n=document.querySelector('[data-v64-preview-name]'),t=document.querySelector('[data-v64-preview-team]'),cu=document.querySelector('[data-v64-preview-curp]');
  if(n)n.textContent=name;if(t)t.textContent=teamName+' · '+cat;if(cu)cu.textContent=curp?'CURP ••••'+curp.slice(-4):'CURP ••••';
}

function v64CurpDob(curp){
  const c=String(curp||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  const m=c.match(/^[A-Z]{4}(\d{2})(\d{2})(\d{2})/);if(!m)return '';
  const yy=Number(m[1]),mm=Number(m[2]),dd=Number(m[3]);
  if(mm<1||mm>12||dd<1||dd>31)return '';
  const now=new Date(),currentYear=now.getFullYear();
  let year=(/[A-Z]/.test(c.charAt(16))?2000:1900)+yy;
  if(year>currentYear)year-=100;
  if(currentYear-year>120)year+=100;
  const test=new Date(year,mm-1,dd);
  if(test.getFullYear()!==year||test.getMonth()!==mm-1||test.getDate()!==dd||test>now)return '';
  return String(year).padStart(4,'0')+'-'+String(mm).padStart(2,'0')+'-'+String(dd).padStart(2,'0');
}
function v64OcrDate(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.replace(/\s+/g,' ').trim()).filter(Boolean);
  const labeled=lines.findIndex(x=>/FECHA\s+(DE\s+)?NACIMIENTO|NACIMIENTO/i.test(x));
  const sample=labeled>=0?[lines[labeled],lines[labeled+1]||''].join(' '):String(text||'');
  const m=sample.match(/\b(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})\b/);
  if(!m)return '';
  let y=Number(m[3]);const mo=Number(m[2]),d=Number(m[1]);
  if(y<100)y=(y<=Number(String(new Date().getFullYear()).slice(-2))?2000:1900)+y;
  const test=new Date(y,mo-1,d);
  if(test.getFullYear()!==y||test.getMonth()!==mo-1||test.getDate()!==d)return '';
  return String(y).padStart(4,'0')+'-'+String(mo).padStart(2,'0')+'-'+String(d).padStart(2,'0');
}
function v64OcrValueAfter(lines,re){
  for(let i=0;i<lines.length;i++){
    if(!re.test(lines[i]))continue;
    const same=lines[i].replace(re,'').replace(/^\s*[:\-]\s*/,'').trim();
    if(same&&same.length>2)return same;
    const next=lines[i+1]||'';
    if(next&&!/^(NOMBRE|APELLIDO|DOMICILIO|CURP|CLAVE|FECHA|SEXO|MUNICIPIO|LOCALIDAD|CIUDAD|COMUNIDAD|ENTIDAD|SECCION|VIGENCIA)\b/i.test(next))return next;
  }
  return '';
}
function v64FixCurpChar(ch,pos){
  ch=String(ch||'').toUpperCase();
  const digitPos=pos>=4&&pos<=9||pos===17;
  if(digitPos){
    const map={O:'0',Q:'0',D:'0',I:'1',L:'1',Z:'2',S:'5',G:'6',B:'8'};
    return /\d/.test(ch)?ch:(map[ch]||ch);
  }
  if(pos===10)return ch==='H'||ch==='M'?ch:(ch==='N'?'M':ch);
  if((pos>=0&&pos<=3)||(pos>=11&&pos<=15)){
    const map={'0':'O','1':'I','2':'Z','5':'S','6':'G','8':'B'};
    return /[A-Z]/.test(ch)?ch:(map[ch]||ch);
  }
  return ch;
}
function v64NormalizeCurpCandidate(value){
  let c=String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(c.length!==18)return '';
  c=c.split('').map((ch,pos)=>v64FixCurpChar(ch,pos)).join('');
  if(!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(c))return '';
  if(!v64CurpDob(c))return '';
  return c;
}
function v64CurpCheckDigit(curp){
  const chars='0123456789ABCDEFGHIJKLMNÑOPQRSTUVWXYZ';
  const c=String(curp||'').toUpperCase().replace(/[^A-Z0-9Ñ]/g,'');
  if(c.length!==18)return null;
  let sum=0;
  for(let i=0;i<17;i++){const v=chars.indexOf(c[i]);if(v<0)return null;sum+=v*(18-i)}
  return (10-(sum%10))%10;
}
function v64CurpChecksumValid(curp){
  const c=String(curp||'').toUpperCase().replace(/[^A-Z0-9Ñ]/g,'');
  if(!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(c))return false;
  const d=v64CurpCheckDigit(c);return d!==null&&String(d)===c[17];
}
function v64NamePartsForCurp(name){
  const p=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-ZÑ ]+/g,' ').split(/\s+/).filter(Boolean);
  if(p.length<3)return null;
  const maternal=p[p.length-1],paternal=p[p.length-2],given=p.slice(0,-2);
  const common=new Set(['JOSE','J','MARIA','MA']);
  const g=(common.has(given[0])&&given[1]?given[1]:given[0])||'X';
  const vowel=(paternal.slice(1).match(/[AEIOU]/)||['X'])[0];
  return {prefix:(paternal[0]||'X')+vowel+(maternal[0]||'X')+(g[0]||'X')};
}
function v64CurpEntityValid(curp){
  const code=String(curp||'').slice(11,13);
  return new Set(['AS','BC','BS','CC','CL','CM','CS','CH','DF','DG','GT','GR','HG','JC','MC','MN','MS','NT','NL','OC','PL','QT','QR','SP','SL','SR','TC','TS','TL','VZ','YN','ZS','NE']).has(code);
}
function v64RepairCurpCandidate(value,name='',allowCheckRepair=false){
  let raw=String(value||'').toUpperCase().replace(/[^A-Z0-9]/g,'');
  if(raw.length!==18)return '';
  let c=raw.split('').map((ch,pos)=>v64FixCurpChar(ch,pos)).join('');
  const np=v64NamePartsForCurp(name);
  if(np)c=np.prefix+c.slice(4);
  if(!/^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/.test(c))return '';
  if(!v64CurpDob(c)||!v64CurpEntityValid(c))return '';
  if(v64CurpChecksumValid(c))return c;
  if(allowCheckRepair){
    const digit=v64CurpCheckDigit(c);
    if(digit!==null){
      const fixed=c.slice(0,17)+String(digit);
      if(v64CurpChecksumValid(fixed))return fixed;
    }
  }
  return '';
}
function v64IneStateCurpCode(text){
  const raw=String(text||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const m=raw.match(/\bESTADO\s*[:\-]?\s*([0-3OQIDLSBGZ]{2})\b/);
  if(!m)return '';
  const mapDigit={O:'0',Q:'0',D:'0',I:'1',L:'1',Z:'2',S:'5',G:'6',B:'8'};
  const n=m[1].split('').map(ch=>/\d/.test(ch)?ch:(mapDigit[ch]||ch)).join('');
  const states={
    '01':'AS','02':'BC','03':'BS','04':'CC','05':'CL','06':'CM','07':'CS','08':'CH',
    '09':'DF','10':'DG','11':'GT','12':'GR','13':'HG','14':'JC','15':'MC','16':'MN',
    '17':'MS','18':'NT','19':'NL','20':'OC','21':'PL','22':'QT','23':'QR','24':'SP',
    '25':'SL','26':'SR','27':'TC','28':'TS','29':'TL','30':'VZ','31':'YN','32':'ZS'
  };
  return states[n]||'';
}
function v64ElectorIdentity(text){
  const raw=String(text||'').toUpperCase();
  const mapDigit={O:'0',Q:'0',D:'0',I:'1',L:'1',Z:'2',S:'5',G:'6',B:'8'};
  const lines=raw.split(/\r?\n/);
  const pools=[];
  for(let i=0;i<lines.length;i++){
    const line=lines[i];
    if(/ELECTOR|CLAVE/.test(line))pools.push(line+' '+(lines[i+1]||''));
  }
  pools.push(raw);
  for(const pool of pools){
    const compact=pool.replace(/[^A-Z0-9]/g,'');
    for(let i=0;i<=compact.length-18;i++){
      let s=compact.slice(i,i+18);
      const letters=s.slice(0,6);
      if(!/^[A-Z]{6}$/.test(letters))continue;
      let dob=s.slice(6,12).split('').map(ch=>/\d/.test(ch)?ch:(mapDigit[ch]||ch)).join('');
      let sex=s[14];
      if(sex==='N')sex='M';
      if(!/^\d{6}$/.test(dob)||!/^[HM]$/.test(sex))continue;
      const yy=Number(dob.slice(0,2)),mm=Number(dob.slice(2,4)),dd=Number(dob.slice(4,6));
      if(mm<1||mm>12||dd<1||dd>31)continue;
      return {dob,sex,raw:s};
    }
  }
  return null;
}
function v64CurpInternalConsonants(name){
  const p=String(name||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-ZÑ ]+/g,' ').split(/\s+/).filter(Boolean);
  if(p.length<3)return '';
  const maternal=p[p.length-1],paternal=p[p.length-2],given=p.slice(0,-2);
  const common=new Set(['JOSE','J','MARIA','MA']);
  const g=(common.has(given[0])&&given[1]?given[1]:given[0])||'X';
  const inner=w=>{
    const m=String(w||'').slice(1).replace(/Ñ/g,'X').match(/[BCDFGHJKLMNPQRSTVWXYZ]/);
    return m?m[0]:'X';
  };
  return inner(paternal)+inner(maternal)+inner(g);
}
function v64CurpTailHints(text){
  const raw=String(text||'').toUpperCase(),out=[];
  const lines=raw.split(/\r?\n/);
  const mapDigit={O:'0',Q:'0',D:'0',I:'1',L:'1',Z:'2',S:'5',G:'6',B:'8'};
  for(const line of lines){
    const near=/CURP/.test(line);
    const cleaned=line.replace(/CURP\s*[:\-]?/g,' ').replace(/[^A-Z0-9]/g,'');
    for(let i=0;i<=cleaned.length-18;i++){
      const s=cleaned.slice(i,i+18);
      let h=s[16],d=s[17];
      if(mapDigit[h])h=mapDigit[h];
      if(mapDigit[d])d=mapDigit[d];
      if(/^\d\d$/.test(h+d))out.push({tail:h+d,score:near?40:10});
    }
  }
  out.sort((a,b)=>b.score-a.score);
  return [...new Set(out.map(x=>x.tail))];
}
function v64CurpStateCatalog(){
  return {
    AS:'Aguascalientes',BC:'Baja California',BS:'Baja California Sur',CC:'Campeche',
    CL:'Coahuila',CM:'Colima',CS:'Chiapas',CH:'Chihuahua',DF:'Ciudad de México',
    DG:'Durango',GT:'Guanajuato',GR:'Guerrero',HG:'Hidalgo',JC:'Jalisco',
    MC:'Estado de México',MN:'Michoacán',MS:'Morelos',NT:'Nayarit',NL:'Nuevo León',
    OC:'Oaxaca',PL:'Puebla',QT:'Querétaro',QR:'Quintana Roo',SP:'San Luis Potosí',
    SL:'Sinaloa',SR:'Sonora',TC:'Tabasco',TS:'Tamaulipas',TL:'Tlaxcala',
    VZ:'Veracruz',YN:'Yucatán',ZS:'Zacatecas',NE:'Nacido en el extranjero'
  };
}
function v64DobDigitsFromInputs(text){
  const manual=document.querySelector('[data-v100-dob]')?.value||'';
  if(/^\d{4}-\d{2}-\d{2}$/.test(manual))return manual.slice(2,4)+manual.slice(5,7)+manual.slice(8,10);
  const explicit=v64OcrDate(text);
  if(/^\d{4}-\d{2}-\d{2}$/.test(explicit))return explicit.slice(2,4)+explicit.slice(5,7)+explicit.slice(8,10);
  return v64ElectorIdentity(text)?.dob||'';
}
function v64SexFromInputs(text){
  const manual=String(document.querySelector('[data-v100-sex]')?.value||'').toUpperCase();
  if(manual==='H'||manual==='M')return manual;
  return v64ElectorIdentity(text)?.sex||'';
}
function v64ManualBirthStateCode(){
  const v=String(document.querySelector('[data-v100-birth-state]')?.value||'').toUpperCase();
  return v64CurpStateCatalog()[v]?v:'';
}
function v64CurpOcrFragments(text){
  const raw=String(text||'').toUpperCase();
  const fragments=[];
  const add=s=>{
    const x=String(s||'').replace(/[^A-Z0-9]/g,'');
    if(x.length>=14&&x.length<=24)fragments.push(x);
    if(x.length>24){
      for(let i=0;i<=x.length-18;i++)fragments.push(x.slice(i,i+18));
    }
  };
  raw.split(/\r?\n/).forEach(line=>{
    add(line);
    const toks=line.replace(/[^A-Z0-9]+/g,' ').split(/\s+/).filter(Boolean);
    for(let a=0;a<toks.length;a++){
      let joined='';
      for(let b=a;b<Math.min(toks.length,a+6)&&joined.length<=24;b++){
        joined+=toks[b];add(joined);
      }
    }
  });
  return [...new Set(fragments)].slice(0,180);
}
function v64CurpCharScore(expected,seen){
  if(expected===seen)return 1;
  const groups=[new Set(['0','O','Q','D']),new Set(['1','I','L']),new Set(['2','Z']),new Set(['5','S']),new Set(['6','G']),new Set(['8','B']),new Set(['M','N'])];
  if(groups.some(g=>g.has(expected)&&g.has(seen)))return .72;
  return 0;
}
function v64CurpCandidateOcrScore(candidate,fragment){
  const c=String(candidate||''),f=String(fragment||'');
  if(c.length!==18||f.length<14)return 0;
  let best=0;
  const starts=f.length>=18?Array.from({length:f.length-17},(_,i)=>i):[0];
  for(const st of starts){
    const w=f.length>=18?f.slice(st,st+18):f;
    let score=0,total=0;
    const offset=w.length===18?0:Math.max(0,18-w.length);
    for(let i=offset;i<18;i++){
      const j=i-offset;if(j>=w.length)break;
      const weight=i<=3?.35:(i<=9?1.35:(i===10?2:(i<=12?1.9:(i<=15?1.45:2.8))));
      total+=weight;
      score+=weight*v64CurpCharScore(c[i],w[j]);
    }
    best=Math.max(best,total?score/total:0);
  }
  return best;
}
function v64InferCurpFromIne(text,name){
  const np=v64NamePartsForCurp(name);
  const inner=v64CurpInternalConsonants(name);
  const dob=v64DobDigitsFromInputs(text);
  const sex=v64SexFromInputs(text);
  if(!np||!inner||!/^[0-9]{6}$/.test(dob)||!/^[HM]$/.test(sex))return '';

  const manualState=v64ManualBirthStateCode();
  const ineState=v64IneStateCurpCode(text);
  const states=manualState?[manualState]:Object.keys(v64CurpStateCatalog());
  const fullDob=document.querySelector('[data-v100-dob]')?.value||'';
  let born2000=false;
  if(/^\d{4}-/.test(fullDob))born2000=Number(fullDob.slice(0,4))>=2000;
  else born2000=Number(dob.slice(0,2))<=Number(String(new Date().getFullYear()).slice(-2));
  const homoclaves=born2000?'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''):'0123456789'.split('');
  const fragments=v64CurpOcrFragments(text);
  const tails=v64CurpTailHints(text);
  const candidates=[];

  for(const state of states){
    for(const hom of homoclaves){
      const first17=np.prefix+dob+sex+state+inner+hom;
      if(first17.length!==17)continue;
      const digit=v64CurpCheckDigit(first17+'0');
      if(digit===null)continue;
      const curp=first17+String(digit);
      if(!v64CurpChecksumValid(curp))continue;

      let ocr=0;
      for(const frag of fragments)ocr=Math.max(ocr,v64CurpCandidateOcrScore(curp,frag));
      let score=ocr*100;
      if(manualState&&state===manualState)score+=35;
      else if(ineState&&state===ineState)score+=10;
      if(tails.includes(curp.slice(16)))score+=24;
      else if(tails.some(t=>t[0]===curp[16]))score+=9;
      candidates.push({curp,score,ocr,state});
    }
  }

  candidates.sort((a,b)=>b.score-a.score);
  const top=candidates[0],second=candidates[1];
  if(!top)return '';

  // Solo completa automáticamente cuando hay evidencia suficiente y margen.
  const margin=top.score-(second?.score||0);
  const strongTail=tails.includes(top.curp.slice(16));
  if((top.ocr>=.70&&margin>=3)||(top.ocr>=.64&&strongTail&&margin>=2)||(manualState&&top.ocr>=.58&&margin>=2)){
    return top.curp;
  }
  return '';
}
function v64FindCurp(text,name=''){
  const raw=String(text||'').toUpperCase(),lines=raw.split(/\r?\n/),candidates=[];
  const push=(value,score,near=false)=>{
    const fixed=v64RepairCurpCandidate(value,name,near);
    if(!fixed)return;
    const old=candidates.find(x=>x.fixed===fixed);
    if(old){old.score=Math.max(old.score,score);return}
    candidates.push({fixed,score});
  };
  for(let li=0;li<lines.length;li++){
    const line=lines[li],near=/\bCURP\b/.test(line)||/CLAVE\s+U[NÑ]ICA/.test(line);
    const neighborhood=[lines[li-1]||'',line,lines[li+1]||''].join(' ');
    const cleaned=(near?neighborhood:line).replace(/CURP\s*[:\-]?/g,' ').replace(/[^A-Z0-9]/g,'');
    for(let p=0;p<=cleaned.length-18;p++)push(cleaned.slice(p,p+18),(near?170:0)+28,near);
    const tokens=(near?neighborhood:line).replace(/[^A-Z0-9]+/g,' ').split(/\s+/).filter(Boolean);
    for(let a=0;a<tokens.length;a++){
      let joined='';
      for(let b=a;b<Math.min(tokens.length,a+6)&&joined.length<=22;b++){
        joined+=tokens[b];
        if(joined.length===18)push(joined,(near?170:0)+34-(b-a),near);
      }
    }
  }
  const flat=raw.replace(/[^A-Z0-9]/g,'');
  for(let p=0;p<=flat.length-18;p++)push(flat.slice(p,p+18),10,false);
  candidates.sort((a,b)=>b.score-a.score);
  if(candidates[0]?.fixed)return candidates[0].fixed;

  // Si la línea CURP quedó muy dañada, reconstruye sólo con datos que sí están impresos
  // en la misma INE: nombre, fecha/sexo de la clave de elector, ESTADO y el final OCR.
  return v64InferCurpFromIne(raw,name);
}
function v64GoodCity(value){
  const v=String(value||'').trim();
  if(v.length<3||v.length>80)return '';
  if(/EMISI[ÓO]N|VIGENCIA|SECCI[ÓO]N|CLAVE|ELECTOR|CREDENCIAL|INSTITUTO|NACIONAL|FECHA|NACIMIENTO|\b\d{4}\b/i.test(v))return '';
  const letters=(v.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g)||[]).length;
  const digits=(v.match(/\d/g)||[]).length;
  if(letters<3||digits>2)return '';
  return v.replace(/\s+/g,' ').trim();
}
function v64KnownPlaceFromText(text){
  const normalized=String(text||'').toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/0/g,'O');
  const compact=normalized.replace(/[^A-ZÑ]/g,'');
  const known=[
    ['SANTACRUZDEJUVENTINOROSAS','Santa Cruz de Juventino Rosas'],
    ['JUVENTINOROSAS','Juventino Rosas'],
    ['CELAYA','Celaya'],
    ['COMONFORT','Comonfort'],
    ['CORTAZAR','Cortázar'],
    ['VILLAGRAN','Villagrán'],
    ['SALAMANCA','Salamanca'],
    ['RINCONDECENTENO','Rincón de Centeno'],
    ['CERRITODEGASCA','Cerrito de Gasca'],
    ['FRANCOTAVERA','Franco Tavera'],
    ['TAVERA','Tavera'],
    ['SANJUANDELACRUZ','San Juan de la Cruz'],
    ['SANTIAGODECUENDA','Santiago de Cuenda'],
    ['SANANTONIODEROMERILLO','San Antonio de Romerillo'],
    ['ROMERILLO','San Antonio de Romerillo'],
    ['FRACCIONAMIENTOCOMONTUOSO','Fraccionamiento Comontuoso'],
    ['COMONTUOSO','Comontuoso'],
    ['POZOS','Pozos'],
    ['RINCONDECENTENO','Rincón de Centeno'],
    ['SANJOSEDELAMONTANA','San José de la Montaña'],
    ['SANJULIANTIERRABLANCA','San Julián Tierra Blanca'],
    ['RINCONDEPARRA','Rincón de Parra'],
    ['VALENCIADEFUERA','Valencia de Fuera']
  ];
  const hit=known.find(([k])=>compact.includes(k));
  if(hit)return hit[1];
  const nearGto=normalized.match(/([A-ZÑ ]{4,45})\s*,?\s*GTO\b/);
  if(nearGto){
    const place=nearGto[1].replace(/\b(CALLE|COLONIA|COL|MUNICIPIO|LOCALIDAD|DOMICILIO|CP|C P)\b/g,' ').replace(/\s+/g,' ').trim();
    if(place.length>=4&&place.length<=45)return place.toLowerCase().replace(/(^|\s)\p{L}/gu,m=>m.toUpperCase());
  }
  return '';
}
function v64LooksLikeIne(text){
  const t=String(text||'');
  const curpOnly=/CLAVE\s+U[NÚ]NICA\s+DE\s+REGISTRO\s+DE\s+POBLACI[ÓO]N|CONSTANCIA\s+DE\s+LA\s+CURP|REGISTRO\s+NACIONAL\s+DE\s+POBLACI[ÓO]N/i.test(t);
  const ine=/INSTITUTO\s+NACIONAL\s+ELECTORAL|CREDENCIAL\s+PARA\s+VOTAR|CLAVE\s+DE\s+ELECTOR|DOMICILIO|SECCI[ÓO]N|VIGENCIA|A[NÑ]O\s+DE\s+REGISTRO/i.test(t);
  const addressish=/\bGTO\.?\b|GUANAJUATO|C\.P\.?\s*\d{4,5}|\bCP\s*\d{4,5}/i.test(t);
  return !curpOnly&&(ine||addressish||!!v64KnownPlaceFromText(t));
}
function v64PlausiblePersonLine(value){
  const v=String(value||'').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]/g,' ').replace(/\s+/g,' ').trim();
  if(v.length<2||v.length>55||/INSTITUTO|NACIONAL|ELECTORAL|CREDENCIAL|VOTAR|DOMICILIO|CLAVE|CURP|SECCI[ÓO]N|VIGENCIA|FECHA|NACIMIENTO|MUNICIPIO|LOCALIDAD|ESTADO/i.test(v))return '';
  const words=v.split(/\s+/).filter(Boolean),shorts=words.filter(w=>w.length<=1).length;
  if(!words.length||shorts>0||words.length>5)return '';
  return v;
}
function v64IneNameFromText(text){
  const lines=String(text||'').split(/\r?\n/).map(x=>x.replace(/[|]/g,'I').replace(/\s+/g,' ').trim()).filter(Boolean);
  const i=lines.findIndex(x=>/\bNOMBRE(?:S)?\b/i.test(x));
  if(i<0)return '';
  const parts=[],same=v64PlausiblePersonLine(lines[i].replace(/^.*?NOMBRE(?:S)?\s*[:\-]?\s*/i,''));
  if(same)parts.push(same);
  for(let j=i+1;j<Math.min(lines.length,i+6);j++){
    if(/^(DOMICILIO|CLAVE|CURP|FECHA|SEXO|ESTADO|MUNICIPIO|LOCALIDAD|CIUDAD|COMUNIDAD|ENTIDAD|SECCI[ÓO]N|VIGENCIA|A[NÑ]O)\b/i.test(lines[j]))break;
    const p=v64PlausiblePersonLine(lines[j]);if(p)parts.push(p);
    if(parts.length>=3)break;
  }
  if(parts.length>=3){
    const paternal=parts[0],maternal=parts[1],given=parts.slice(2).join(' ');
    return (given+' '+paternal+' '+maternal).replace(/\s+/g,' ').trim();
  }
  if(parts.length===1){
    const w=parts[0].split(/\s+/).filter(Boolean);
    if(w.length>=3)return (w.slice(2).join(' ')+' '+w[0]+' '+w[1]).trim();
  }
  return '';
}
function v64ParseOcrIdentity(text){
  const raw=String(text||''),up=raw.toUpperCase();
  const lines=raw.split(/\r?\n/).map(x=>x.replace(/[|]/g,'I').replace(/\s+/g,' ').trim()).filter(Boolean);
  const isIne=v64LooksLikeIne(raw);

  let name=isIne?v64IneNameFromText(raw):'';
  if(!name){
    const given=v64OcrValueAfter(lines,/^NOMBRE(?:S)?\b/i);
    const first=v64OcrValueAfter(lines,/^(?:PRIMER\s+APELLIDO|APELLIDO\s+PATERNO)\b/i);
    const second=v64OcrValueAfter(lines,/^(?:SEGUNDO\s+APELLIDO|APELLIDO\s+MATERNO)\b/i);
    if((first||second)&&given)name=[given,first,second].filter(Boolean).join(' ');
  }
  if(!name&&!isIne){
    for(let i=0;i<lines.length;i++){
      if(!/^NOMBRE(?:S)?\b/i.test(lines[i]))continue;
      const firstLine=lines[i].replace(/^NOMBRE(?:S)?\s*[:\-]?\s*/i,'').trim(),parts=[];
      if(firstLine)parts.push(firstLine);
      for(let j=i+1;j<Math.min(lines.length,i+4);j++){
        if(/^(DOMICILIO|CLAVE|CURP|FECHA|SEXO|ESTADO|MUNICIPIO|LOCALIDAD|CIUDAD|COMUNIDAD|ENTIDAD|SECCION|VIGENCIA|APELLIDO)\b/i.test(lines[j]))break;
        if(!/\d/.test(lines[j]))parts.push(lines[j]);
      }
      name=parts.join(' ');break;
    }
  }
  name=String(name||'').replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ .'-]/g,' ').replace(/\s+/g,' ').trim();
  const nw=name.split(/\s+/).filter(Boolean),shorts=nw.filter(w=>w.length<=2).length;
  const vowelCount=(name.match(/[AEIOUÁÉÍÓÚÜaeiouáéíóúü]/g)||[]).length;
  if(name.length<4||name.length>80||nw.length<2||nw.length>6||shorts/Math.max(1,nw.length)>.34||vowelCount<2||
     /INSTITUTO|ELECTORAL|CREDENCIAL|VOTAR|FECHA|NACIM|EMISI[ÓO]N|VIGENCIA|DEPENDENCIA|MUNICIPIO|SECCI[ÓO]N/i.test(name))name='';

  let curp=v64FindCurp(raw,name);

  let city='';
  if(isIne){
    for(const re of [/^(?:CIUDAD|MUNICIPIO|LOCALIDAD|COMUNIDAD|POBLACION|POBLACIÓN)\b/i]){
      city=v64OcrValueAfter(lines,re);if(city)break;
    }
    if(!city)city=v64KnownPlaceFromText(raw);
    if(!city){
      const d=lines.findIndex(x=>/^DOMICILIO\b/i.test(x));
      if(d>=0){
        const addr=[];
        for(let j=d+1;j<Math.min(lines.length,d+6);j++){
          if(/^(CLAVE|CURP|FECHA|SEXO|SECCION|VIGENCIA)\b/i.test(lines[j]))break;
          addr.push(lines[j]);
        }
        city=v64KnownPlaceFromText(addr.join(' '));
        if(!city){
          const place=addr.slice().reverse().find(x=>/GTO\.?|GUANAJUATO|MUNICIPIO|LOCALIDAD|C\.P\.|\bCP\b/i.test(x));
          if(place)city=place;
        }
      }
    }
    city=v64GoodCity(String(city||'').replace(/^\s*[:\-]\s*/,'').replace(/\s+/g,' ').trim().slice(0,100));
  }

  const dob=v64CurpDob(curp)||v64OcrDate(raw);
  const elector=v64ElectorIdentity(raw);
  const sex=(curp&&/^[A-Z]{4}\d{6}[HM]/.test(curp))?curp[10]:(elector?.sex||'');
  const birthState=(curp&&v64CurpStateCatalog()[curp.slice(11,13)])?curp.slice(11,13):'';
  return {name,curp,dob,city,sex,birthState};
}
function v64ApplyOcrIdentity(p){
  const set=(selector,value)=>{if(!value)return;const el=document.querySelector(selector);if(!el)return;el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))};
  set('[data-v64-cred-name]',p.name);
  set('[data-v64-cred-curp]',p.curp);
  set('[data-v100-dob]',p.dob);
  set('[data-v100-sex]',p.sex);
  set('[data-v100-birth-state]',p.birthState);
  set('[data-v100-city]',p.city);
  v64CredentialSync();
}

async function v64BitmapFromFile(file){
  if('createImageBitmap' in window)return await createImageBitmap(file);
  return await new Promise((resolve,reject)=>{
    const img=new Image(),url=URL.createObjectURL(file);
    img.onload=()=>{URL.revokeObjectURL(url);resolve(img)};img.onerror=e=>{URL.revokeObjectURL(url);reject(e)};img.src=url;
  });
}
async function v64PrepareOcrImage(file,mode='contrast'){
  try{
    const img=await v64BitmapFromFile(file),iw=img.width||img.naturalWidth,ih=img.height||img.naturalHeight;
    if(!iw||!ih)return file;
    const target=Math.min(2600,Math.max(1800,iw*2));
    const scale=target/iw,w=Math.max(1,Math.round(iw*scale)),h=Math.max(1,Math.round(ih*scale));
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});
    x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';x.drawImage(img,0,0,w,h);
    const data=x.getImageData(0,0,w,h),p=data.data;
    for(let i=0;i<p.length;i+=4){
      const g=.299*p[i]+.587*p[i+1]+.114*p[i+2];
      let v;
      if(mode==='binary')v=g>168?255:g<92?0:Math.max(0,Math.min(255,(g-92)*3.35));
      else v=Math.max(0,Math.min(255,(g-128)*1.75+128));
      p[i]=p[i+1]=p[i+2]=v;p[i+3]=255;
    }
    x.putImageData(data,0,0);
    return await new Promise(resolve=>c.toBlob(b=>resolve(b||file),'image/jpeg',.94));
  }catch(e){return file}
}
async function v64PrepareOcrCrop(file,region='nameA'){
  try{
    const img=await v64BitmapFromFile(file),iw=img.width||img.naturalWidth,ih=img.height||img.naturalHeight;
    if(!iw||!ih)return null;
    const landscape=iw>=ih;
    let sx,sy,sw,sh;
    if(landscape){
      const map={
        nameA:[.03,.16,.60,.38],
        nameB:[.03,.22,.72,.34],
        nameC:[.02,.12,.90,.48],
        nameWide:[.01,.08,.98,.55],
        nameD:[.02,.28,.70,.30],
        nameE:[.02,.34,.72,.24],
        data:[.02,.40,.96,.56],
        curpBand:[.12,.40,.86,.36],
        curpLow:[.12,.54,.86,.28]
      };
      [sx,sy,sw,sh]=map[region]||map.nameA;
    }else{
      const map={
        nameA:[.04,.16,.92,.34],
        nameB:[.04,.24,.92,.34],
        nameC:[.03,.12,.94,.50],
        nameWide:[.02,.08,.96,.56],
        nameD:[.03,.28,.94,.30],
        nameE:[.03,.34,.94,.24],
        data:[.03,.40,.94,.56],
        curpBand:[.03,.40,.94,.36],
        curpLow:[.03,.54,.94,.28]
      };
      [sx,sy,sw,sh]=map[region]||map.nameA;
    }
    sx*=iw;sy*=ih;sw*=iw;sh*=ih;
    const target=2400,scale=target/sw,w=Math.max(1,Math.round(sw*scale)),h=Math.max(1,Math.round(sh*scale));
    const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d',{willReadFrequently:true});
    x.imageSmoothingEnabled=true;x.imageSmoothingQuality='high';
    x.drawImage(img,sx,sy,sw,sh,0,0,w,h);
    const data=x.getImageData(0,0,w,h),p=data.data;
    for(let i=0;i<p.length;i+=4){
      const g=.299*p[i]+.587*p[i+1]+.114*p[i+2];
      const v=Math.max(0,Math.min(255,(g-128)*2.15+128));
      p[i]=p[i+1]=p[i+2]=v;p[i+3]=255;
    }
    x.putImageData(data,0,0);
    return await new Promise(resolve=>c.toBlob(b=>resolve(b),'image/jpeg',.97));
  }catch(e){return null}
}
function v64CleanNameCandidate(text){
  return String(text||'')
    .replace(/INSTITUTO\s+NACIONAL\s+ELECTORAL/ig,' ')
    .replace(/CREDENCIAL\s+PARA\s+VOTAR/ig,' ')
    .replace(/ESTADOS?\s+UNIDOS\s+MEXICANOS/ig,' ')
    .replace(/NOMBRE(?:S)?/ig,' ')
    .replace(/DOMICILIO|CLAVE\s+DE\s+ELECTOR|CURP|SECCI[ÓO]N|VIGENCIA|FECHA\s+DE\s+NACIMIENTO/ig,' ')
    .replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ'\-\s]/g,' ')
    .replace(/\s+/g,' ').trim();
}
function v64NameFromFocusedText(text){
  const ine=v64IneNameFromText(text);if(ine)return ine;
  const lines=String(text||'').split(/\r?\n/).map(v64CleanNameCandidate).filter(x=>x.length>=4&&x.length<=70);
  const bad=/mexico|méxico|electoral|credencial|votar|domicilio|sexo|clave|estado|entidad|municipio|localidad|poblaci[oó]n|secci[oó]n|vigencia|emisi[oó]n|expedici[oó]n|dependencia|registro|fecha|nacimiento|calle|colonia|c[oó]digo|postal|cero/i;
  const useful=lines.filter(x=>{
    if(bad.test(x))return false;
    const words=x.split(/\s+/).filter(Boolean),content=words.filter(w=>!/^(de|del|la|las|los|y)$/i.test(w));
    const shorts=content.filter(w=>w.length<=2).length;
    const vowels=(x.match(/[AEIOUÁÉÍÓÚÜaeiouáéíóúü]/g)||[]).length;
    return content.length>=2&&content.length<=5&&shorts/Math.max(1,content.length)<=.25&&vowels>=2;
  });
  return useful.map(x=>{
    const words=x.split(/\s+/).filter(Boolean),content=words.filter(w=>!/^(de|del|la|las|los|y)$/i.test(w));
    const letters=(x.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g)||[]).length;
    let score=(content.length>=2?28:0)+(content.length>=3?24:0)+(content.length===3||content.length===4?18:0)+Math.min(38,letters);
    if(v64NameStrength(x)<0)score=-999;
    return {x,score};
  }).filter(o=>o.score>0).sort((a,b)=>b.score-a.score)[0]?.x||'';
}
function v64OcrQuality(text,confidence){
  const t=String(text||''),p=v64ParseOcrIdentity(t);
  let score=Number(confidence||0);
  score+=(p.name?90:0)+(p.curp?150:0)+(p.dob?70:0)+(p.city?55:0);
  score+=Math.min(90,(t.match(/[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g)||[]).length*.7);
  score-=Math.min(80,(t.match(/[<>_=]{1,}/g)||[]).length*6);
  return {score,parsed:p};
}
function v64OcrNorm(v){
  return String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9Ñ]+/g,' ').replace(/\s+/g,' ').trim();
}
function v64NameStrength(name){
  const n=String(name||'').replace(/\s+/g,' ').trim();
  const normalized=v64OcrNorm(n);
  const words=n.split(/\s+/).filter(Boolean);
  if(!n||words.length<2||words.length>7)return -999;
  const labelNoise=/\b(INSTITUTO|NACIONAL|ELECTORAL|CREDENCIAL|VOTAR|DOMICILIO|CLAVE|CURP|SECCI[ÓO]N|VIGENCIA|EMISI[ÓO]N|EXPEDICI[ÓO]N|DEPENDENCIA|MUNICIPIO|LOCALIDAD|POBLACI[ÓO]N|ENTIDAD|ESTADO|REGISTRO|FECHA|NACIMIENTO|SEXO|CALLE|COLONIA|C[ÓO]DIGO|POSTAL|CERO|A[NÑ]O)\b/i;
  if(labelNoise.test(normalized))return -999;
  const connectors=new Set(['DE','DEL','LA','LAS','LOS','Y']);
  const content=words.filter(w=>!connectors.has(v64OcrNorm(w)));
  if(content.length<2)return -999;
  const shorts=content.filter(w=>v64OcrNorm(w).length<=2).length;
  const vowels=(n.match(/[AEIOUÁÉÍÓÚÜaeiouáéíóúü]/g)||[]).length;
  if(shorts/content.length>.25||vowels<2)return -999;
  let score=42+Math.min(42,n.length)+Math.min(24,content.length*6);
  if(content.length===3||content.length===4)score+=18;
  if(content.every(w=>v64OcrNorm(w).length>=3))score+=12;
  if(/^[A-ZÁÉÍÓÚÜÑ'\-\s]+$/.test(n))score+=5;
  return score;
}
function v64NameTokenSimilarity(a,b){
  const A=v64OcrNorm(a).split(' ').filter(Boolean),B=v64OcrNorm(b).split(' ').filter(Boolean);
  if(!A.length||!B.length)return 0;
  let hit=0;
  for(const x of A){
    let best=0;
    for(const y of B){
      if(x===y){best=1;break}
      if(x.length>=4&&y.length>=4){
        const m=Math.min(x.length,y.length),same=[...Array(m)].filter((_,i)=>x[i]===y[i]).length;
        best=Math.max(best,same/Math.max(x.length,y.length));
      }
    }
    if(best>=.72)hit++;
  }
  return hit/Math.max(A.length,B.length);
}
function v64BestOfficialNameFromTexts(texts){
  let players=[];
  try{players=window.LJR_PLAYER_REGISTRY?.officialPlayers?.()||[]}catch(_){}
  if(!players.length)return '';
  const joined=v64OcrNorm(texts.join('\n'));
  let best=null,score=0;
  for(const p of players){
    const words=v64OcrNorm(p?.name).split(' ').filter(w=>w.length>=3);
    if(words.length<2)continue;
    let exact=0;
    for(const w of words)if(joined.includes(w))exact++;
    const s=exact/words.length;
    if(exact>=2&&s>score){score=s;best=p}
  }
  return score>=.5?String(best?.name||''):'';
}
function v64ResolveName(texts){
  const candidates=[];
  const add=(name,sourceWeight=0)=>{
    name=String(name||'').replace(/\s+/g,' ').trim();
    const base=v64NameStrength(name);if(base<0)return;
    candidates.push({name,score:base+sourceWeight});
  };
  for(const t of texts){
    add(v64IneNameFromText(t),24);
    add(v64NameFromFocusedText(t),10);
  }
  add(v64BestOfficialNameFromTexts(texts),42);
  if(!candidates.length)return '';
  for(const a of candidates){
    for(const b of candidates){
      if(a===b)continue;
      const sim=v64NameTokenSimilarity(a.name,b.name);
      if(sim>=.66)a.score+=22*sim;
    }
  }
  candidates.sort((a,b)=>b.score-a.score);
  const top=candidates[0],second=candidates[1];
  if(!top||top.score<76)return '';
  if(second&&top.score-second.score<7&&v64NameTokenSimilarity(top.name,second.name)<.55)return '';
  return top.name;
}
function v64ResolveIdentity(texts){
  const clean=texts.filter(Boolean),joined=clean.join('\n');
  const name=v64ResolveName(clean);
  const parsed=clean.map(t=>v64ParseOcrIdentity(t));
  let city='',dob='';
  for(const p of parsed){if(!city&&p.city)city=p.city;if(!dob&&p.dob)dob=p.dob}
  if(!city&&v64LooksLikeIne(joined))city=v64KnownPlaceFromText(joined);
  const curp=v64FindCurp(joined,name);
  if(curp)dob=v64CurpDob(curp)||dob;
  return {name,curp,dob,city};
}
let v64OcradPromise=null;
function v64LoadOcrad(){
  if(window.OCRAD)return Promise.resolve(window.OCRAD);
  if(v64OcradPromise)return v64OcradPromise;
  v64OcradPromise=new Promise(resolve=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/ocrad.js@0.1.1/ocrad.min.js';
    s.async=true;s.onload=()=>resolve(window.OCRAD||null);s.onerror=()=>resolve(null);
    document.head.appendChild(s);
  });
  return v64OcradPromise;
}
async function v64BlobToCanvas(blob,maxW=2200){
  const img=await v64BitmapFromFile(blob),iw=img.width||img.naturalWidth,ih=img.height||img.naturalHeight;
  const scale=Math.min(1,maxW/Math.max(1,iw)),w=Math.max(1,Math.round(iw*scale)),h=Math.max(1,Math.round(ih*scale));
  const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);return c;
}
async function v64OcradText(blob){
  try{
    const O=await v64LoadOcrad();if(!O||!blob)return '';
    const c=await v64BlobToCanvas(blob,1900);
    return String(O(c)||'');
  }catch(_){return ''}
}
async function v64NativeText(blob){
  try{
    if(!window.TextDetector||!blob)return '';
    const detector=new window.TextDetector(),img=await v64BitmapFromFile(blob),blocks=await detector.detect(img);
    return (blocks||[]).map(b=>b.rawValue||b.text||'').filter(Boolean).join('\n');
  }catch(_){return ''}
}
async function v64TesseractRead(T,image,psm='6',whitelist=''){
  if(!image)return {text:'',confidence:0};
  try{
    const opts={tessedit_pageseg_mode:String(psm),preserve_interword_spaces:'1'};
    if(whitelist)opts.tessedit_char_whitelist=whitelist;
    const r=await T.recognize(image,'spa',opts);
    return {text:r?.data?.text||'',confidence:Number(r?.data?.confidence||0)};
  }catch(_){return {text:'',confidence:0}}
}
async function v64RecognizeDocument(file,onStatus){
  const T=await v64LoadTesseract(),seen=[],push=t=>{if(t&&String(t).trim())seen.push(String(t))};

  onStatus?.('OCR inteligente · lectura inicial…');
  const contrast=await v64PrepareOcrImage(file,'contrast');
  const binary=await v64PrepareOcrImage(file,'binary');

  const native=await v64NativeText(file);push(native);
  const full1=await v64TesseractRead(T,contrast,'11');push(full1.text);
  const full2=await v64TesseractRead(T,binary,'6');push(full2.text);

  let parsed=v64ResolveIdentity(seen);

  if(!parsed.name||v64NameStrength(parsed.name)<80){
    onStatus?.('Analizando zona del nombre…');
    for(const region of ['nameA','nameB','nameC','nameD','nameE','nameWide']){
      const crop=await v64PrepareOcrCrop(file,region);if(!crop)continue;
      const a=await v64TesseractRead(T,crop,'6');push(a.text);
      if(!parsed.name&&(region==='nameD'||region==='nameE')){
        const line=await v64TesseractRead(T,crop,'7');push(line.text);
      }
      if(region==='nameWide'){
        const b=await v64TesseractRead(T,crop,'11');push(b.text);
        const o=await v64OcradText(crop);push(o);
      }
      parsed=v64ResolveIdentity(seen);
      if(parsed.name&&v64NameStrength(parsed.name)>=105)break;
    }
  }

  if(!parsed.curp){
    onStatus?.('Validando CURP…');
    for(const region of ['curpBand','curpLow']){
      const curpCrop=await v64PrepareOcrCrop(file,region);if(!curpCrop)continue;
      const c1=await v64TesseractRead(T,curpCrop,'7','ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');push(c1.text);
      const c2=await v64TesseractRead(T,curpCrop,'11','ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');push(c2.text);
      parsed=v64ResolveIdentity(seen);
      if(parsed.curp)break;
    }
  }

  if(!parsed.city||!parsed.curp){
    onStatus?.('Revisando datos de la INE…');
    const dataCrop=await v64PrepareOcrCrop(file,'data');
    if(dataCrop){
      const d1=await v64TesseractRead(T,dataCrop,'6');push(d1.text);
      const d2=await v64OcradText(dataCrop);push(d2);
    }
    parsed=v64ResolveIdentity(seen);
  }

  // Último pase original completo, útil cuando el preprocesamiento elimina trazos finos.
  if(!parsed.name||!parsed.curp){
    onStatus?.('Confirmando con lectura original…');
    const raw=await v64TesseractRead(T,file,'11');push(raw.text);
    parsed=v64ResolveIdentity(seen);
  }

  // Nunca devolver CURP si no pasa estructura + dígito verificador.
  if(parsed.curp&&!v64CurpChecksumValid(parsed.curp))parsed.curp='';
  // Nunca devolver nombre si el consenso no alcanza calidad mínima.
  if(parsed.name&&v64NameStrength(parsed.name)<76)parsed.name='';
  if(parsed.name&&/\b(LOCALIDAD|EMISI[ÓO]N|VIGENCIA|SECCI[ÓO]N|MUNICIPIO|ENTIDAD|DOMICILIO|REGISTRO|CERO)\b/i.test(parsed.name))parsed.name='';

  return {text:seen[0]||'',allText:seen.join('\n'),parsed,score:(parsed.name?100:0)+(parsed.curp?180:0)+(parsed.city?60:0)+(parsed.dob?60:0)};
}

function v64LoadTesseract(){
  if(window.Tesseract)return Promise.resolve(window.Tesseract);
  return new Promise(function(resolve,reject){const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';s.onload=function(){resolve(window.Tesseract)};s.onerror=reject;document.head.appendChild(s)});
}

const V64_APP_URL='https://jairofrancog7-star.github.io/App-liga-/?mode=apk#/home';
const V64_QR_SRC='https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data='+encodeURIComponent(V64_APP_URL);
function ligaQRView(){
  return '<section class="v60-tool-page v64-qr-page">'+
    v60Header('ACCESO A LA LIGA','QR de la Liga','Comparte la aplicación oficial de la Liga Municipal de Fútbol Juventino Rosas sin añadir contenido de entrenamientos.')+
    '<article class="v60-panel v64-qr-card">'+
      '<div class="v64-qr-frame"><img src="'+V64_QR_SRC+'" alt="Código QR para abrir la app de la Liga Municipal de Fútbol Juventino Rosas" loading="eager" decoding="async"></div>'+
      '<h2>Abre la app oficial</h2>'+
      '<p>Escanea este código con la cámara de otro teléfono. El QR abre directamente la aplicación de la Liga.</p>'+
      '<code class="v64-qr-url">'+V64_APP_URL+'</code>'+
      '<div class="v60-actions">'+
        '<a class="v60-link" href="'+V64_APP_URL+'" target="_blank" rel="noopener noreferrer">Abrir app</a>'+
        '<button class="v60-btn outline" data-v64-share>Compartir</button>'+
        '<button class="v60-btn ghost" data-v64-copy>Copiar enlace</button>'+
      '</div>'+
    '</article>'+
    '<div class="v60-panel v64-qr-how">'+
      '<div class="v60-row"><span class="v60-row-copy"><b>1 · Mostrar el QR</b><small>Abre esta pantalla desde Más → QR de la Liga.</small></span></div>'+
      '<div class="v60-row"><span class="v60-row-copy"><b>2 · Escanear</b><small>La otra persona apunta su cámara al código.</small></span></div>'+
      '<div class="v60-row"><span class="v60-row-copy"><b>3 · Abrir la Liga</b><small>El enlace lleva a la app, no a contenidos de entrenamientos.</small></span></div>'+
    '</div>'+
    '<div class="v60-actions"><button class="v60-btn outline" data-route="search">Buscar en la Liga</button><button class="v60-btn ghost" data-route="leagueTools">Todas las herramientas</button></div>'+
  '</section>';
}

function moreView(){
  return '<section class="v19-more-page" data-v19-more>'+
    '<img class="v19-more-logo" src="'+V19_MORE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas" loading="eager" decoding="async">'+
    '<div class="v19-more-menu">'+
      v19MoreButton('star','Siguiendo','following')+
      v19MoreButton('shield','Equipos','teams')+
      v19MoreButton('performance','Performance Zone','safe-performance',true)+
      v19MoreButton('medal','Máximo goleador','scorers')+
      v19MoreButton('video','Momentos','moments')+
      v19MoreButton('data','Datos','leagueData',true)+
      v19MoreButton('qr','QR de la Liga','ligaQR')+
    '</div>'+
    '<div class="v19-more-label">Gaming</div>'+
    '<div class="v19-more-menu">'+
      v19MoreButton('score','Pronostica Seis','predictor')+
      v19MoreButton('quiz','Quiz Arena','quizArena')+
      v19MoreButton('arrows','Más O Menos','moreLess')+
    '</div>'+
    '<div class="v19-more-label event">En el evento</div>'+
    '<div class="v19-more-menu">'+v19MoreButton('glasses','Hospitalidad','hospitality')+'</div>'+
    '<div class="v19-more-menu">'+
      v19MoreButton('info','Reglamento','rulebook')+
      v19MoreButton('data','Todas las herramientas','leagueTools')+
    '</div>'+
    '<div class="v19-more-label explore">Explorar</div>'+
    '<div class="v19-more-menu">'+
      v19MoreButton('search','Buscar','search')+
      v19MoreButton('trophy','Rankings de la Liga','rankings')+
      v19MoreButton('history','Historia','history')+
      v19MoreButton('bag','Tienda','club-store')+
      v19MoreButton('info','Sobre la Liga Municipal','safe-about',true)+
    '</div>'+
    '<div class="v19-more-bottom">'+
      '<p class="v19-sponsor-title">Patrocinadores oficiales de la Liga</p>'+
      '<div class="v19-sponsors">'+
        '<div class="v19-sponsor s1"><div><span class="town-mark">♜</span><b>JUVENTINO<br>ROSAS</b></div></div>'+
        '<div class="v19-sponsor s2"><div>Pasión<br><b>Local</b></div></div>'+
        '<div class="v19-sponsor s3"><div><b>NUESTRO<br>FÚTBOL</b><span class="ball-mini">⚽</span></div></div>'+
        '<div class="v19-sponsor s4"><div><span class="people-mark">●●●</span><b>COMUNIDAD<br>EN ACCIÓN</b></div></div>'+
        '<div class="v19-sponsor s5"><div><b>DEPORTE<br>UNE</b><i></i></div></div>'+
      '</div>'+
      '<div class="v19-official">App oficial de la Liga<img src="'+V19_MORE_LOGO+'" alt="Liga Municipal de Fútbol Juventino Rosas" loading="lazy" decoding="async"></div>'+
    '</div>'+
  '</section>';
}
function hospitalityView(){
  return '<div class="eyebrow">EN EL EVENTO</div><h1 class="screen-title">Hospitalidad</h1>'+
    '<section class="section"><div class="profile-card"><h2>Hospitalidad de la Liga</h2><p>Consulta sedes, accesos y servicios disponibles para los partidos de la Liga Municipal de Fútbol Juventino Rosas.</p><div class="button-row"><button class="btn primary" data-route="venues">Ver campos / sedes</button><button class="btn outline" data-route="competition">Ver partidos</button></div></div></section>'+
    '<section class="section"><div class="section-head"><h2>Accesos rápidos</h2></div><div class="menu-group">'+
      '<button class="menu-row" data-route="venues"><span>Campos y sedes<small>Ubicación y próximos partidos</small></span><span>›</span></button>'+
      '<button class="menu-row" data-route="competition"><span>Jornada y resultados<small>Partidos programados y marcadores</small></span><span>›</span></button>'+
      '<button class="menu-row" data-route="notices"><span>Noticias y avisos<small>Información para equipos y afición</small></span><span>›</span></button>'+
    '</div></section>';
}
function storeView(){
  return '<div class="eyebrow">LIGA JUVENTINO</div><h1 class="screen-title">Tienda</h1>'+
    '<section class="section"><div class="profile-card"><h2>Tienda de clubes</h2><p>Selecciona un equipo para consultar su perfil y preparar su espacio de artículos oficiales de la Liga.</p></div></section>'+
    '<div class="team-list">'+teams.map(t=>'<div class="team-row"><button class="team-main" data-team="'+t.code+'">'+crest(t.code)+'<span><b>'+t.name+'</b><small>Ver club y artículos</small></span></button><button class="mini-btn" data-team="'+t.code+'">Abrir</button></div>').join('')+'</div>';
}
function quizArenaView(){
  const correct='San José FC';
  const options=[['A','Juventus'],['B','Hermanos'],['C','San José FC'],['D','Linces']];
  return `<section class="v48-quiz-arena-page v48-playing" data-v48-arena data-v48-correct="${correct}" aria-label="Quiz Arena">

    <div class="v48-arena-landing" data-v48-landing>
      <header class="v48-arena-head">
        <button type="button" class="v48-back-real" data-route="more" aria-label="Volver a Más">
          <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>
        </button>
        <h1>Quiz Arena</h1>
      </header>

      <section class="v48-arena-card" aria-label="Entrar a Quiz Arena">
        <div class="v48-ball-stage" aria-hidden="true">
          <div class="v48-local-visual">
            <img class="v48-local-league" src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/liga-logo.webp" alt="">
            <div class="v48-local-logos">
              <span><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/juventus.png" alt=""></span>
              <span><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/hermanos.png" alt=""></span>
              <span><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/san-jose-fc.png" alt=""></span>
              <span><img src="https://raw.githubusercontent.com/jairofrancog7-star/Liga_Futbol/main/assets/official-logos/linces.png" alt=""></span>
            </div>
            <strong>QUIZ ARENA</strong>
            <small>LIGA MUNICIPAL · JUVENTINO ROSAS</small>
          </div>
        </div>
        <div class="v48-arena-actions">
          <button type="button" class="v48-primary" data-route="profile">Inicia sesión para<br>jugar</button>
          <button type="button" class="v48-secondary" data-v48-start>Prueba como<br>invitado</button>
        </div>
      </section>

      <div class="v48-arena-promo" aria-label="Liga Municipal de Fútbol Juventino Rosas">
        <span class="v48-promo-mark">JR</span>
        <span><b>LIGA JUVENTINO ROSAS</b><small>Quiz oficial · Fútbol municipal</small></span>
        <strong>JUGAR</strong>
      </div>

      <section class="v48-challenge-card">
        <div>
          <h2>¡Reta a tus amigos en el Quiz!</h2>
          <p>Demuestra cuánto sabes de nuestra liga.</p>
          <button type="button" data-v48-start>Jugar ahora</button>
        </div>
        <div class="v48-mini-ball" aria-hidden="true"><i></i></div>
      </section>

      <button type="button" class="v48-ranking-link" data-route="rankings">
        <span>Clasificaciones</span><b>›</b>
      </button>
    </div>

    <section class="v48-game" data-v48-game aria-label="Quiz de la Liga" aria-hidden="true">
      <button type="button" class="v48-game-back" data-v48-game-back aria-label="Volver a Quiz Arena">
        <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M20.5 7.5 12 16l8.5 8.5M12.5 16H27"/></svg>
      </button>

      <div class="v48-game-logo" aria-label="Quiz de la Liga">
        <span class="v48-game-quiz">QUIZ</span>
        <span class="v48-game-de">DE LA</span>
        <span class="v48-game-liga">LIGA</span>
        <i class="v48-game-check" aria-hidden="true"></i>
        <i class="v48-game-left" aria-hidden="true"></i>
        <i class="v48-game-right" aria-hidden="true"></i>
      </div>
      <div class="v48-game-subtitle"><i></i><span>LIGA MUNICIPAL DE FÚTBOL<br>JUVENTINO ROSAS</span><i></i></div>

      <div class="v48-game-card">
        <p>¿Qué equipo lidera actualmente la tabla?</p>
        ${options.map(([letter,label])=>`<button type="button" class="v48-game-option" data-v48-quiz="${label}" aria-label="${letter}. ${label}"><span class="v48-game-letter">${letter}</span><span class="v48-game-text">${label}</span><span class="v48-game-ok" aria-hidden="true">✓</span></button>`).join('')}
      </div>

      <div class="v48-game-stadium" aria-hidden="true"><i></i><i></i><span></span></div>
      <div class="v48-game-message" aria-live="polite"></div>
    </section>
  </section>`;
}
function quizView(){
  const correct='San José FC';
  const options=[['A','Juventus'],['B','Hermanos'],['C','San José FC'],['D','Linces']];
  return `<section class="v30-quiz-page" data-quiz-correct="${correct}"><div class="v30-quiz-logo"><span class="v30-logo-quiz">QUIZ</span><span class="v30-logo-de">DE LA</span><span class="v30-logo-liga">LIGA</span></div><div class="quiz-card"><p>¿Qué equipo lidera actualmente la tabla?</p>${options.map(([letter,label])=>`<button type="button" class="quiz-option" data-quiz="${label}"><span class="v30-answer-letter">${letter}</span><span class="v30-answer-text">${label}</span></button>`).join('')}</div></section>`;
}function moreLessView(){const a=players[0],b=players[1];return `<div class="game-hero"><span class="eyebrow">REGISTROS OFICIALES</span><h1 class="game-title">MÁS<br>O MENOS</h1><p class="muted">Las comparaciones se habilitarán cuando AdminFut publique estadísticas individuales verificables.</p><div class="compare-two">${a?`<button data-player="${a.id}"><div class="avatar-ball">⚽</div><b>${a.name}</b><small>${team(a.team).name}</small></button>`:''}<span>VS</span>${b?`<button data-player="${b.id}"><div class="avatar-ball">⚽</div><b>${b.name}</b><small>${team(b.team).name}</small></button>`:''}</div></div>`}function venuesView(){return `<div class="eyebrow">SEDES</div><h1 class="screen-title">Campos</h1><div class="news-list">${[...new Set(teams.map(t=>t.field))].map((v,i)=>`<div class="news-row"><span class="venue-thumb"></span><span><small>Sede ${i+1}</small><b>${v}</b><p>Consulta los próximos partidos programados.</p></span></div>`).join('')}</div>`}
const views={home:homeView,competition:competitionView,match:matchView,video:videoView,fantasy:fantasyView,fantasyTeam:fantasyTeamView,fantasyLeagues:()=>`<div class="eyebrow">FANTASY</div><h1 class="screen-title">Ligas</h1><div class="profile-card"><h2>Compite con amigos</h2><p>Crea una liga privada o únete con un código.</p><div class="button-row"><button class="btn primary" data-action="create-league">Crear liga</button><button class="btn outline" data-action="join-league">Unirme</button></div></div>`,more:moreView,ligaQR:ligaQRView,hospitality:hospitalityView,'club-store':storeView,following:followingView,teams:teamsView,teamDetail:teamDetailView,players:playersView,playerDetail:playerDetailView,playerCompare:()=>'<div data-v123-player-compare-mount></div>',scorers:scorersView,moments:momentsView,stats:statsView,rankings:rankingsView,history:historyView,news:newsView,notices:noticesView,scheduleChanges:scheduleChangesView,newsDetail:newsDetailView,transfers:transfersView,favorites:favoritesView,search:searchView,vote:voteView,notifications:notificationsView,privacy:privacyView,profile:profileView,predictor:predictorView,predictorSix:predictorSixView,quizArena:quizArenaView,quiz:quizArenaView,moreLess:moreLessView,moreLessHub:()=>`<div data-v52-mount></div>`,venues:v60VenuesView,discipline:()=>'<div data-v94-discipline-mount></div>',disciplina:()=>'<div data-v94-discipline-mount></div>',disciplineTool:()=>'<div data-v94-discipline-mount></div>',leagueTools:leagueToolsView,v38Stats:v38StatsView,v38Weekly:v38WeeklyView,v38Weather:v38WeatherView,v38Alerts:v38AlertsView,tableExport:v64ExportTableView,bracketBuilder:v64BracketView,credentialBuilder:v64CredentialBuilderView,cedulaBuilder:v64CedulaBuilderView,agendaBuilder:v64AgendaView,motionHub:v64MotionView,suspensionTool:v64SuspensionView,rulebook:rulebookView,matchday:matchdayView,weatherFields:weatherFieldsView,cedulas:cedulasView,cedulaDetail:cedulaDetailView,credential:credentialView,publications:publicationsView,tactics:tacticsView,simulator:simulatorView,jrControl:jrControlView,error:()=>`<div class="empty-state"><div class="empty-illustration error"></div><h2>No pudimos cargar la información</h2><p>Comprueba tu conexión e inténtalo nuevamente.</p><button class="btn outline" data-route="home">Reintentar</button></div>`};
function render(){if(state.route==='quiz'){state.route='quizArena';if(location.hash!=='#/quizArena')history.replaceState(null,'','#/quizArena')}if(state.route==='theme'){setTheme(state.theme==='dark'?'light':'dark');state.route='more'}screen.innerHTML=views[state.route]?views[state.route]():views.home();const rootRoutes=['home','competition','video','fantasy','more'];backButton.classList.toggle('is-hidden',rootRoutes.includes(state.route));const navRoute=['discipline','disciplina','disciplineTool'].includes(state.route)?'competition':['predictor','predictorSix','quizArena','quiz','moreLess','moreLessHub','ligaQR','leagueTools','v38Stats','v38Weekly','v38Weather','v38Alerts','tableExport','bracketBuilder','credentialBuilder','cedulaBuilder','agendaBuilder','motionHub','suspensionTool','rulebook','matchday','weatherFields','venues','cedulas','cedulaDetail','credential','publications','tactics','simulator','jrControl','leagueData','playerCompare','notices','scheduleChanges'].includes(state.route)?'more':state.route;navItems.forEach(n=>n.classList.toggle('active',n.dataset.route===navRoute));bind();window.scrollTo(0,0)}
function go(route,push=true){if(route==='quiz')route='quizArena';if(push&&state.route!==route)state.history.push(state.route);state.route=route;location.hash='#/'+route;render()}
function bind(){document.querySelectorAll('[data-route]').forEach(el=>el.onclick=()=>go(el.dataset.route));
function noticeDraft(){
  const pick=s=>document.querySelector(s);
  const matchId=pick('[data-ljr-notice-match]')?.value||'';
  const m=matches.find(x=>String(x.id)===String(matchId));
  return {
    id:'notice-'+Date.now(),
    type:pick('[data-ljr-notice-type]')?.value||'Aviso general',
    category:pick('[data-ljr-notice-category]')?.value||'',
    title:(pick('[data-ljr-notice-title]')?.value||'').trim(),
    date:pick('[data-ljr-notice-date]')?.value||'',
    time:pick('[data-ljr-notice-time]')?.value||'',
    venue:(pick('[data-ljr-notice-venue]')?.value||'').trim(),
    message:(pick('[data-ljr-notice-message]')?.value||'').trim(),
    matchId,
    matchLabel:m?(team(m.home).name+' vs '+team(m.away).name):'',
    createdAt:Date.now(),
    createdLabel:'Publicado desde la app'
  };
}
async function shareNoticeItem(n){
  const text=ljrNoticeText(n);
  try{
    if(navigator.share)await navigator.share({title:n.title||'Aviso de la Liga',text});
    else{await navigator.clipboard.writeText(text);toast('Aviso copiado')}
  }catch(e){}
}
document.querySelector('[data-ljr-notice-match]')?.addEventListener('change',e=>{
  const m=matches.find(x=>String(x.id)===String(e.target.value||''));
  if(!m)return;
  const title=document.querySelector('[data-ljr-notice-title]');
  const cat=document.querySelector('[data-ljr-notice-category]');
  const time=document.querySelector('[data-ljr-notice-time]');
  const venue=document.querySelector('[data-ljr-notice-venue]');
  if(title&&!title.value)title.value='Cambio de horario · '+team(m.home).name+' vs '+team(m.away).name;
  if(cat)cat.value=m.category||'';
  if(time)time.value=/^\d{1,2}:\d{2}$/.test(String(m.time||''))?String(m.time).padStart(5,'0'):'';
  if(venue)venue.value=m.venue||'';
});
document.querySelector('[data-ljr-notice-publish]')?.addEventListener('click',()=>{
  const n=noticeDraft();
  if(!n.title&&!n.message){toast('Escribe un título o mensaje para el aviso');return}
  if(!n.title)n.title=n.type;
  const list=ljrReadNotices();list.unshift(n);ljrWriteNotices(list);
  toast('Aviso guardado en Publicaciones recientes');
  go('notices');
});
document.querySelector('[data-ljr-notice-share-draft]')?.addEventListener('click',()=>shareNoticeItem(noticeDraft()));
document.querySelector('[data-ljr-notice-copy-draft]')?.addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(ljrNoticeText(noticeDraft()));toast('Texto del aviso copiado')}catch(e){toast('No se pudo copiar')}
});
document.querySelector('[data-ljr-notice-whatsapp]')?.addEventListener('click',()=>{
  const txt=encodeURIComponent(ljrNoticeText(noticeDraft()));
  window.open('https://wa.me/?text='+txt,'_blank','noopener,noreferrer');
});
document.querySelector('[data-ljr-notice-test]')?.addEventListener('click',async()=>{
  const n=noticeDraft(),title=n.title||n.type||'Aviso de la Liga',body=n.message||[n.date,n.time,n.venue].filter(Boolean).join(' · ')||'Liga Juventino Rosas';
  try{
    if(!('Notification' in window)){toast('Este navegador no admite notificaciones locales');return}
    let p=Notification.permission;
    if(p==='default')p=await Notification.requestPermission();
    if(p==='granted')new Notification(title,{body});
    else toast('Permiso de notificaciones no concedido');
  }catch(e){toast('No se pudo mostrar la notificación en este teléfono')}
});
document.querySelectorAll('[data-ljr-notice-share]').forEach(el=>el.onclick=()=>{
  const n=ljrReadNotices().find(x=>x.id===el.dataset.ljrNoticeShare);if(n)shareNoticeItem(n)
});
document.querySelectorAll('[data-ljr-notice-copy]').forEach(el=>el.onclick=async()=>{
  const n=ljrReadNotices().find(x=>x.id===el.dataset.ljrNoticeCopy);if(!n)return;
  try{await navigator.clipboard.writeText(ljrNoticeText(n));toast('Aviso copiado')}catch(e){}
});
document.querySelectorAll('[data-ljr-notice-delete]').forEach(el=>el.onclick=()=>{
  ljrWriteNotices(ljrReadNotices().filter(x=>x.id!==el.dataset.ljrNoticeDelete));toast('Aviso eliminado');render()
});
document.querySelectorAll('[data-v48-start]').forEach(el=>el.onclick=()=>{const page=el.closest('[data-v48-arena]');if(!page)return;page.classList.add('v48-playing');page.querySelector('[data-v48-game]')?.setAttribute('aria-hidden','false');window.scrollTo({top:0,behavior:'smooth'});window.setTimeout(()=>page.querySelector('[data-v48-quiz]')?.focus({preventScroll:true}),260)});
document.querySelectorAll('[data-v48-game-back]').forEach(el=>el.onclick=()=>{const page=el.closest('[data-v48-arena]');if(!page)return;page.classList.remove('v48-playing','v48-answered');page.dataset.v48Answered='false';page.querySelector('[data-v48-game]')?.setAttribute('aria-hidden','true');page.querySelectorAll('[data-v48-quiz]').forEach(btn=>{btn.disabled=false;btn.classList.remove('is-correct','is-wrong');btn.removeAttribute('aria-pressed')});const msg=page.querySelector('.v48-game-message');if(msg)msg.textContent='';window.scrollTo({top:0,behavior:'smooth'})});
document.querySelectorAll('[data-v48-quiz]').forEach(el=>el.onclick=()=>{const page=el.closest('[data-v48-arena]');if(!page)return;page.dataset.v48LastAnswer=el.dataset.v48Quiz||'';page.classList.remove('v48-playing','v48-answered');page.dataset.v48Answered='false';page.querySelector('[data-v48-game]')?.setAttribute('aria-hidden','true');page.querySelectorAll('[data-v48-quiz]').forEach(btn=>{btn.disabled=false;btn.classList.remove('is-correct','is-wrong');btn.removeAttribute('aria-pressed')});const msg=page.querySelector('.v48-game-message');if(msg)msg.textContent='';window.scrollTo({top:0,behavior:'smooth'});window.setTimeout(()=>page.querySelector('[data-v48-start]')?.focus({preventScroll:true}),260)});

document.querySelectorAll('[data-v60-pdf-prev]').forEach(el=>el.onclick=()=>v60RenderRulebookPage(v60RulebookPage-1));
document.querySelectorAll('[data-v60-pdf-next]').forEach(el=>el.onclick=()=>v60RenderRulebookPage(v60RulebookPage+1));
if(state.route==='rulebook')requestAnimationFrame(()=>v60RenderRulebookPage(v60RulebookPage||1));
document.querySelectorAll('[data-v60-comp]').forEach(el=>el.onclick=()=>{state.competitionTab=el.dataset.v60Comp||'fixtures';save();go('competition')});
document.querySelectorAll('[data-v63-comp]').forEach(el=>el.onclick=()=>{state.competitionTab=el.dataset.v63Comp||'standings';save();go('competition')});
document.querySelectorAll('[data-v63-official]').forEach(el=>el.onclick=()=>{const tab=el.dataset.v63Official||'summary';localStorage.setItem('v62-data-tab',tab);try{window.LJR_OFFICIAL_API?.setDataTab?.(tab)}catch(e){}go('leagueData')});
document.querySelectorAll('[data-v60-all-players]').forEach(el=>el.onclick=()=>{
  localStorage.setItem('v66-player-cat','all');
  localStorage.setItem('v66-player-team','all');
  localStorage.setItem('v66-open-all','1');
  state.searchQuery='';
  go('players');
});
document.querySelectorAll('[data-v60-check]').forEach(el=>el.onchange=()=>{const s=v60MatchdayState();s[el.dataset.v60Check]=el.checked;localStorage.setItem('v60-matchday',JSON.stringify(s));toast('Match Day actualizado')});
document.querySelector('[data-v64-export-png]')?.addEventListener('click',async()=>{const b=await v64CanvasTable();if(b)v64Download(b,'Liga_Juventino_Tabla.png')},{once:true});
document.querySelector('[data-v64-share-png]')?.addEventListener('click',async()=>{const b=await v64CanvasTable();if(!b)return;const file=new File([b],'Liga_Juventino_Tabla.png',{type:'image/png'});try{if(navigator.canShare?.({files:[file]}))await navigator.share({title:'Tabla Liga Juventino Rosas',files:[file]});else v64Download(b,file.name)}catch(e){}},{once:true});
document.querySelector('[data-v64-export-csv]')?.addEventListener('click',()=>{const rows=v64StandingsRows(),csv='Posicion,Equipo,PJ,DG,PTS\n'+rows.map(r=>[r.pos,r.name,r.pj,r.dg,r.pts].map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');v64Download(new Blob([csv],{type:'text/csv;charset=utf-8'}),'Liga_Juventino_Tabla.csv')},{once:true});
document.querySelector('[data-v64-bracket-png]')?.addEventListener('click',async()=>{const b=await v64CanvasBracket();if(b)v64Download(b,'Liga_Juventino_Cuadro.png')},{once:true});
document.querySelector('[data-v64-doc]')?.addEventListener('change',e=>{
  const file=e.target.files?.[0],host=document.querySelector('[data-v64-doc-preview]');
  if(!host)return;
  host.innerHTML=file?'<img alt="Vista previa del documento CURP o INE">':'<span>Vista previa del documento</span>';
  if(file){const url=URL.createObjectURL(file);const img=host.querySelector('img');img.src=url;img.onload=()=>URL.revokeObjectURL(url)}
},{once:true});
document.querySelector('[data-v64-photo]')?.addEventListener('change',e=>{
  const file=e.target.files?.[0],mini=document.querySelector('[data-v64-player-mini-preview]');
  if(!mini)return;
  mini.innerHTML=file?'<img alt="Vista previa de la foto del jugador">':'<span>Vista previa de la foto</span>';
  if(file){const url=URL.createObjectURL(file);const img=mini.querySelector('img');img.src=url;img.onload=()=>URL.revokeObjectURL(url)}
},{once:true});
document.querySelectorAll('[data-v64-cred-name],[data-v64-cred-curp],[data-v64-cred-team],[data-v64-cred-cat]').forEach(el=>{el.addEventListener('input',v64CredentialSync);el.addEventListener('change',v64CredentialSync)});
document.querySelector('[data-v64-cred-team]')?.addEventListener('change',()=>{v64SyncCredentialTeamCategory();v64CredentialSync()});
v64CredentialSync();
document.querySelector('[data-v64-ocr]')?.addEventListener('click',async e=>{
  const live=window.LJR_V155_LIVE_INE;
  const internal=!!window.__LJR_V155_INTERNAL_OCR__;
  if(!internal&&live?.active?.()){live.stop?.();return}
  const docFile=document.querySelector('[data-v64-doc]')?.files?.[0]||null;
  const photoFile=document.querySelector('[data-v64-photo]')?.files?.[0]||null;
  const file=docFile||photoFile,out=document.querySelector('[data-v64-ocr-text]');
  if(!file||!out){
    if(!internal&&live?.start){await live.start();return}
    toast('Selecciona una foto de CURP o INE para intentar obtener los datos');
    return
  }
  if(!docFile&&photoFile)toast('No hay documento en el primer campo; intentaré leer la imagen disponible');
  const btn=e.currentTarget,original=btn.textContent;btn.disabled=true;btn.textContent='Buscando datos…';
  /* Cada lectura empieza limpia para no conservar basura de una prueba anterior. */
  for(const sel of ['[data-v64-cred-name]','[data-v64-cred-curp]','[data-v100-dob]','[data-v100-age]']){
    const el=document.querySelector(sel);if(el)el.value='';
  }
  v64CredentialSync();
  try{
    const best=await v64RecognizeDocument(file,msg=>btn.textContent=msg);
    const txt=best.text||'',all=best.allText||'';out.value=[txt,all].filter(Boolean).join('\n');
    const combined=[txt,all].filter(Boolean).join('\n');
    const strong=best.parsed||v64ResolveIdentity([combined]);
    const p={
      name:v64NameStrength(strong.name)>=76?strong.name:'',
      curp:(strong.curp&&v64CurpChecksumValid(strong.curp))?strong.curp:'',
      dob:strong.dob||'',
      city:''
    };
    v64ApplyOcrIdentity(p);
    const found=[p.name&&'nombre',p.curp&&'CURP',p.dob&&'fecha'].filter(Boolean);
    toast(found.length?'Datos detectados: '+found.join(', ') : 'No encontré datos seguros todavía; conservé la lectura para intentar de nuevo o corregirla');
  }catch(err){
    toast('No se pudo leer el documento; prueba una foto más clara o captura los datos manualmente');
  }finally{
    btn.disabled=false;btn.textContent=original||'Detectar texto';
  }
});
document.querySelector('[data-v64-clear-ocr]')?.addEventListener('click',()=>{
  const selectors=['[data-v64-doc]','[data-v64-ocr-text]','[data-v64-cred-name]','[data-v64-cred-curp]','[data-v100-dob]','[data-v100-age]','[data-v100-city]'];
  selectors.forEach(sel=>{const el=document.querySelector(sel);if(!el)return;if(el.type==='file')el.value='';else el.value=''});
  const docPreview=document.querySelector('[data-v64-doc-preview]');if(docPreview)docPreview.innerHTML='<span>Vista previa del documento</span>';
  v64CredentialSync();
});
document.querySelector('[data-v64-download-credential-png]')?.addEventListener('click',async e=>{e.preventDefault();if(window.LJR_V100?.downloadCredentialPng){await window.LJR_V100.downloadCredentialPng();return}toast('Generador PNG cargando; inténtalo de nuevo')},{once:true});
document.querySelector('[data-v64-print-credential]')?.addEventListener('click',async e=>{e.preventDefault();if(window.LJR_V100?.downloadCredentialPdf){await window.LJR_V100.downloadCredentialPdf();return}document.body.classList.add('v64-print-credential');window.print();setTimeout(()=>document.body.classList.remove('v64-print-credential'),300)},{once:true});
document.querySelector('[data-v64-generate-cedula]')?.addEventListener('click',()=>{const q=s=>document.querySelector(s)?.value||'';const home=q('[data-v64-ced-home]')||'Local',away=q('[data-v64-ced-away]')||'Visitante',cat=q('[data-v64-ced-cat]'),date=q('[data-v64-ced-date]')||'Por confirmar',field=q('[data-v64-ced-field]')||'Por confirmar',ref=q('[data-v64-ced-ref]')||'Por asignar',host=document.querySelector('[data-v64-cedula-preview]');if(host)host.innerHTML='<article class="v60-cedula v64-generated-cedula"><div class="v60-cedula-head"><b>LIGA MUNICIPAL DE FÚTBOL · JUVENTINO ROSAS</b><span>'+v64Esc(cat)+'</span></div><div class="v60-versus"><div><strong>'+v64Esc(home)+'</strong></div><span>VS</span><div><strong>'+v64Esc(away)+'</strong></div></div><div class="v60-cedula-meta"><div><small>Fecha</small><b>'+v64Esc(date)+'</b></div><div><small>Campo</small><b>'+v64Esc(field)+'</b></div><div><small>Árbitro</small><b>'+v64Esc(ref)+'</b></div><div><small>Estado</small><b>Por confirmar</b></div></div></article>';toast('Cédula generada')},{once:true});
document.querySelector('[data-v64-team-template]')?.addEventListener('click',()=>{const h=document.querySelector('[data-v64-ced-home]')?.value||'Local',a=document.querySelector('[data-v64-ced-away]')?.value||'Visitante',csv='Equipo,Numero,Jugador,Posicion,Firma\n'+[h,a].map(n=>'"'+n+'",,,,').join('\n');v64Download(new Blob([csv],{type:'text/csv;charset=utf-8'}),'Plantillas_Equipos.csv')},{once:true});
document.querySelector('[data-v64-print-cedula]')?.addEventListener('click',()=>window.print(),{once:true});
document.querySelector('[data-v64-ag-add]')?.addEventListener('click',()=>{let list=[];try{list=JSON.parse(localStorage.getItem('v64-agenda')||'[]')}catch(e){}const q=s=>document.querySelector(s)?.value||'';list.push({home:q('[data-v64-ag-home]')||'Local',away:q('[data-v64-ag-away]')||'Visitante',field:q('[data-v64-ag-field]'),start:q('[data-v64-ag-start]'),duration:Number(q('[data-v64-ag-duration]')||120)});localStorage.setItem('v64-agenda',JSON.stringify(list));v64RenderAgenda();toast('Cruce guardado en este dispositivo')},{once:true});
document.querySelector('[data-v64-ag-json]')?.addEventListener('click',()=>{let raw=localStorage.getItem('v64-agenda')||'[]';v64Download(new Blob([raw],{type:'application/json'}),'Agenda_Liga_Juventino.json')},{once:true});
document.querySelector('[data-v64-ag-clear]')?.addEventListener('click',()=>{localStorage.removeItem('v64-agenda');v64RenderAgenda();toast('Agenda local limpiada')},{once:true});
v64RenderAgenda();
document.querySelector('[data-v64-motion-toggle]')?.addEventListener('click',e=>{const stage=document.querySelector('[data-v64-orbit]');stage?.classList.toggle('paused');e.currentTarget.textContent=stage?.classList.contains('paused')?'Reanudar movimiento':'Pausar movimiento'},{once:true});
document.querySelector('[data-v64-susp-save]')?.addEventListener('click',()=>{const category=document.querySelector('[data-v64-susp-cat]')?.value||'',jornada=document.querySelector('[data-v64-susp-round]')?.value||'';localStorage.setItem('v64-suspension-draft',JSON.stringify({category,jornada}));toast('Borrador guardado solo en este dispositivo')},{once:true});
document.querySelector('[data-v64-susp-preview]')?.addEventListener('click',()=>{const category=document.querySelector('[data-v64-susp-cat]')?.value||'',jornada=document.querySelector('[data-v64-susp-round]')?.value||'',host=document.querySelector('[data-v64-susp-modal]');if(host)host.innerHTML='<div class="v64-susp-modal"><div><b>⚠ Jornada suspendida hoy</b><button type="button" data-v64-susp-close>×</button></div><p>Se suspende la jornada de la categoría seleccionada que tenía juego programado para hoy.</p><strong>'+v64Esc(category)+'</strong><span>Jornada: '+v64Esc(jornada)+'</span><em>Vista previa · no publicada</em><button class="v60-btn" data-v64-susp-ok>Entendido</button></div>';const close=()=>{if(host)host.innerHTML=''};host?.querySelector('[data-v64-susp-close]')?.addEventListener('click',close);host?.querySelector('[data-v64-susp-ok]')?.addEventListener('click',close)},{once:true});
const v60note=document.querySelector('[data-v60-matchday-note]');if(v60note)v60note.oninput=()=>{const s=v60MatchdayState();s.note=v60note.value;localStorage.setItem('v60-matchday',JSON.stringify(s))};
document.querySelectorAll('[data-v60-weather]').forEach(el=>el.onclick=async()=>{const f=v60Field(el.dataset.v60Weather),out=document.querySelector('[data-v60-weather-result="'+f.id+'"]');if(!out||!f.weather)return;const lat=Number.isFinite(f.lat)?f.lat:f.weatherLat,lon=Number.isFinite(f.lon)?f.lon:f.weatherLon;if(!Number.isFinite(lat)||!Number.isFinite(lon))return;out.hidden=false;out.classList.remove('is-error');out.textContent='Consultando clima…';el.disabled=true;try{const u='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(lat)+'&longitude='+encodeURIComponent(lon)+'&current=temperature_2m,precipitation,weather_code,wind_speed_10m&timezone=America%2FMexico_City';const r=await fetch(u);if(!r.ok)throw new Error('weather');const j=await r.json(),w=j.current||{};out.innerHTML='<b>'+Math.round(w.temperature_2m??0)+' °C</b><div class="v60-weather-grid"><span><b>'+Number(w.precipitation??0).toFixed(1)+' mm</b><small>Precipitación</small></span><span><b>'+Math.round(w.wind_speed_10m??0)+' km/h</b><small>Viento</small></span><span><b>'+String(w.weather_code??'—')+'</b><small>Código clima</small></span></div><small>Actualización: '+String(w.time||'ahora')+'</small>'}catch(e){out.classList.add('is-error');out.textContent='No se pudo consultar el clima en este momento.'}finally{el.disabled=false}});
document.querySelectorAll('[data-v60-cedula]').forEach(el=>el.onclick=()=>{localStorage.removeItem('v66-cedula-source');state.selectedMatch=el.dataset.v60Cedula;save();go('cedulaDetail')});
document.querySelectorAll('[data-v60-print]').forEach(el=>el.onclick=()=>window.print());
document.querySelectorAll('[data-v60-share]').forEach(el=>el.onclick=async()=>{const txt=document.querySelector('[data-v60-share-text]')?.textContent?.trim()||'Liga Juventino Rosas';try{if(navigator.share)await navigator.share({title:'Liga Juventino Rosas',text:txt});else{await navigator.clipboard.writeText(txt);toast('Texto copiado')}}catch(e){}});
document.querySelectorAll('[data-v60-copy]').forEach(el=>el.onclick=async()=>{const txt=document.querySelector('[data-v60-share-text]')?.textContent?.trim()||'';try{await navigator.clipboard.writeText(txt);toast('Texto copiado')}catch(e){toast('No se pudo copiar')}});
document.querySelectorAll('[data-v95-bulletin-kind]').forEach(el=>el.onclick=()=>{
  const kind=el.dataset.v95BulletinKind||'full';
  localStorage.setItem('v95-bulletin-kind',kind);
  const preview=document.querySelector('[data-v60-share-text]');
  if(preview)preview.textContent=v95BulletinText(kind);
  document.querySelectorAll('[data-v95-bulletin-kind]').forEach(b=>b.classList.toggle('active',b===el));
  toast('Boletín generado');
});
document.querySelectorAll('[data-v95-copy-kind]').forEach(el=>el.onclick=async()=>{
  const txt=v95BulletinText(el.dataset.v95CopyKind||'full');
  try{await navigator.clipboard.writeText(txt);toast('Boletín copiado')}catch(e){toast('No se pudo copiar')}
});
document.querySelectorAll('[data-v64-share]').forEach(el=>el.onclick=async()=>{try{if(navigator.share)await navigator.share({title:'Liga Municipal de Fútbol Juventino Rosas',text:'App oficial de la Liga Municipal de Fútbol Juventino Rosas',url:V64_APP_URL});else{await navigator.clipboard.writeText(V64_APP_URL);toast('Enlace de la Liga copiado')}}catch(e){}});
document.querySelectorAll('[data-v64-copy]').forEach(el=>el.onclick=async()=>{try{await navigator.clipboard.writeText(V64_APP_URL);toast('Enlace de la Liga copiado')}catch(e){toast('No se pudo copiar el enlace')}});
document.querySelectorAll('[data-v60-formation]').forEach(el=>el.onclick=()=>{localStorage.setItem('v60-formation',el.dataset.v60Formation);render()});
document.querySelectorAll('[data-v60-sim]').forEach(el=>el.onclick=()=>{const s=v60SimState(),k=el.dataset.v60Sim;s[k]=(s[k]||0)+Number(el.dataset.delta||0);localStorage.setItem('v60-sim',JSON.stringify(s));render()});
document.querySelectorAll('[data-v60-sim-reset]').forEach(el=>el.onclick=()=>{localStorage.removeItem('v60-sim');render()});
document.querySelectorAll('[data-v53-next]').forEach(el=>el.onclick=()=>{state.predictorSlide=((state.predictorSlide||0)+1)%4;render()});document.querySelectorAll('[data-v53-guest]').forEach(el=>el.onclick=()=>{toast('Modo invitado activado · elige tus seis pronósticos')});document.querySelectorAll('[data-comp-tab]').forEach(el=>el.onclick=()=>{state.competitionTab=el.dataset.compTab;render()});document.querySelectorAll('[data-day]').forEach(el=>el.onclick=()=>{state.selectedDay=el.dataset.day;save();render()});document.querySelectorAll('[data-category]').forEach(el=>el.onclick=()=>{state.matchCategory=el.dataset.category;save();render()});document.querySelectorAll('[data-match]').forEach(el=>el.onclick=()=>{state.selectedMatch=el.dataset.match;go('match')});document.querySelectorAll('[data-team]').forEach(el=>el.onclick=()=>{const r=String(location.hash||'').replace('#/','').split('?')[0];if(r==='credentialBuilder'||el.closest?.('#v124-player-registry,[data-v132-layer],[data-v64-cred-team],.v126-team-panel'))return;state.selectedTeam=el.dataset.team;go('teamDetail')});document.querySelectorAll('[data-player]').forEach(el=>el.onclick=()=>{state.selectedPlayer=el.dataset.player;go('playerDetail')});document.querySelectorAll('[data-news]').forEach(el=>el.onclick=()=>{state.selectedNews=el.dataset.news;go('newsDetail')});document.querySelectorAll('[data-follow]').forEach(el=>el.onclick=e=>{e.stopPropagation();const code=el.dataset.follow;state.followed=state.followed.includes(code)?state.followed.filter(x=>x!==code):[...state.followed,code];save();toast(state.followed.includes(code)?`Ahora sigues a ${team(code).name}`:`Dejaste de seguir a ${team(code).name}`);render()});document.querySelectorAll('[data-favorite]').forEach(el=>el.onclick=e=>{e.stopPropagation();const id=el.dataset.favorite;state.favorites=isFav(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];save();toast(isFav(id)?'Guardado en Favoritos':'Eliminado de Favoritos');render()});document.querySelectorAll('[data-cheer]').forEach(el=>el.onclick=()=>{const id=el.dataset.cheer;state.cheers[id]=(state.cheers[id]||0)+1;save();toast('¡Apoyo registrado!');render()});document.querySelectorAll('[data-save-prediction]').forEach(el=>el.onclick=()=>{const id=el.dataset.savePrediction;state.predictions[id]={home:Number(document.querySelector('#predHome').value||0),away:Number(document.querySelector('#predAway').value||0)};save();toast('Pronóstico guardado');render()});document.querySelectorAll('[data-save-prediction-row]').forEach(el=>el.onclick=()=>{const id=el.dataset.savePredictionRow;state.predictions[id]={home:Number(document.querySelector(`#h-${id}`).value||0),away:Number(document.querySelector(`#a-${id}`).value||0)};save();toast('Pronóstico guardado');render()});document.querySelectorAll('[data-v29-pick]').forEach(el=>el.onclick=()=>{const id=el.dataset.v29Pick;const key='six:'+id;const current=state.predictions[key]?.pick??el.dataset.v29Default??'?';const seq=['?','1','X','2'];const pos=seq.indexOf(current);const next=seq[(pos<0?0:pos+1)%seq.length];state.predictions[key]={pick:next};save();toast('Pronóstico '+next+' guardado');render()});document.querySelectorAll('[data-add-player]').forEach(el=>el.onclick=()=>{const p=player(el.dataset.addPlayer);const slots=['POR','DEF','DEF','MED','MED','DEL','DEL'];const valid=slots.map((pos,i)=>({pos,i})).find(s=>s.pos===p.position&&!state.fantasyPicks[s.i]);if(!valid){toast(`No hay espacio libre para ${p.position}`);return}state.fantasyPicks[valid.i]={playerId:p.id};save();toast(`${p.name} agregado`);render()});document.querySelectorAll('[data-fantasy-slot]').forEach(el=>el.onclick=()=>{const slot=el.dataset.fantasySlot;if(state.fantasyPicks[slot]){delete state.fantasyPicks[slot];save();toast('Jugador eliminado');render()}else toast(`Selecciona un jugador ${el.dataset.position} de la lista`)});document.querySelectorAll('[data-history-tab]').forEach(el=>el.onclick=()=>{state.historyTab=el.dataset.historyTab;render()});document.querySelectorAll('[data-stats-tab]').forEach(el=>el.onclick=()=>{state.statsTab=el.dataset.statsTab;render()});document.querySelectorAll('[data-transfer-filter]').forEach(el=>el.onclick=()=>{state.transferFilter=el.dataset.transferFilter;save();render()});document.querySelectorAll('[data-vote]').forEach(el=>el.onclick=()=>{if(state.vote)return;state.vote=el.dataset.vote;save();toast(`Voto registrado para ${el.dataset.voteName||'el jugador seleccionado'}`);render()});document.querySelectorAll('[data-notification]').forEach(el=>el.onchange=()=>{state.notifications[el.dataset.notification]=el.checked;save();toast('Preferencia guardada')});document.querySelectorAll('[data-privacy]').forEach(el=>el.onchange=()=>{state.privacy[el.dataset.privacy]=el.checked;save()});document.querySelectorAll('[data-video]').forEach(el=>el.onclick=()=>openVideo(el.dataset.video));document.querySelectorAll('[data-quiz]').forEach(el=>el.onclick=()=>{const quiz=el.closest('[data-quiz-correct]');if(!quiz||quiz.dataset.quizAnswered==='true')return;quiz.dataset.quizAnswered='true';quiz.classList.add('v30-answer-result');const correct=quiz.dataset.quizCorrect||'Juventino';const buttons=[...quiz.querySelectorAll('[data-quiz]')];buttons.forEach(btn=>{btn.disabled=true;btn.setAttribute('aria-pressed',btn===el?'true':'false');btn.classList.remove('is-wrong');if(btn.dataset.quiz===correct)btn.classList.add('is-correct')});toast(el.dataset.quiz===correct?'¡Correcto! +10 puntos':'Respuesta incorrecta · Correcta: '+correct)});document.querySelectorAll('[data-moreless]').forEach(el=>el.onclick=()=>toast(el.dataset.moreless==='p1'?'¡Correcto! Esa opción tiene más goles':'No esta vez'));document.querySelectorAll('[data-action]').forEach(el=>el.onclick=()=>action(el.dataset.action));const gs=document.querySelector('#globalSearch');if(gs)gs.oninput=()=>{state.searchQuery=gs.value;document.querySelector('#searchResults').innerHTML=searchResultsHtml(gs.value);bind()};const ps=document.querySelector('#playerSearch');if(ps)ps.oninput=()=>{state.searchQuery=ps.value;document.querySelector('#playerResults').innerHTML=filterPlayers(ps.value).map(playerRowHtml).join('');bind()}}
function action(a){if(a==='share'){navigator.share?navigator.share({title:'Liga Juventino',text:'Mira esto en Liga Juventino'}):toast('Contenido listo para compartir')}if(a==='login-demo'){state.user={name:'Aficionado Municipal',email:'aficionado@ligajuventino.mx'};save();toast('Sesión local iniciada');render()}if(a==='logout'){state.user=null;save();render()}if(a==='clear-fantasy'){state.fantasyPicks={};save();render()}if(a==='accept-privacy'){state.privacy.accepted=true;save();toast('Preferencias de privacidad guardadas');render()}if(a==='create-league')toast('Liga privada creada: LJ-2026');if(a==='join-league')toast('Introduce el código de invitación cuando conectemos cuentas')}
function openVideo(title){const modal=document.createElement('div');modal.className='modal';modal.innerHTML=`<div class="video-modal"><button class="modal-close">×</button><div class="video-stage"><button class="play-big">▶</button></div><span class="eyebrow">VIDEO</span><h2>${title}</h2><p class="muted">Reproductor preparado. Añade el archivo o URL real para reproducir contenido oficial.</p><div class="progress"><i style="width:35%"></i></div><button class="btn outline full" data-cheer="video:${title}">Apoyar · ${state.cheers['video:'+title]||0}</button></div>`;document.body.appendChild(modal);modal.querySelector('.modal-close').onclick=()=>modal.remove();modal.onclick=e=>{if(e.target===modal)modal.remove()};modal.querySelector('[data-cheer]').onclick=()=>{const id='video:'+title;state.cheers[id]=(state.cheers[id]||0)+1;save();toast('¡Apoyo registrado!');modal.querySelector('[data-cheer]').textContent=`Apoyar · ${state.cheers[id]}`}}
backButton.onclick=()=>{const prev=state.history.pop();if(prev)go(prev,false);else go('home',false)};window.addEventListener('hashchange',()=>{let r=location.hash.replace('#/','');if(r==='quiz')r='quizArena';if(r.startsWith('v4-'))return;if(r&&r!==state.route){state.route=r;render()}});if(!state.route.startsWith('v4-'))render();