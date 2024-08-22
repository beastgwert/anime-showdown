 const characterInfo = {
   abilities: {
      'Sung-jin-woo': ['Mutilation', 'Shadow Regeneration'],
      'Mikasa': ['Thunder Spears', 'Charge'],
      'Luffy': ['Gum-Gum: Pistol', 'Gear 3'],
      'Gojo': ['Hand-to-hand Combat', 'Limitless'],
      'Natsu': ['Fire Dragon\'s Claws', 'Lightning Fire Dragon'],
   },
   abilityDamages: {
      'Sung-jin-woo': [160, 200],
      'Mikasa': [80, 120],
      'Luffy': [110, 130],
      'Gojo': [100, 200],
      'Natsu': [120, 130],
   },
   enemyAbilityDamages: {
      'Kirito': [200, 250],
      'Doflamingo': [300, 400],
      'Tanjiro': [240, 280],
      'Escanor': [400, 450],
      'Anderson': [500, 501],
      'Korosensei': [525, 575],
      'Hisoka': [100, 1500],
      'Saitama': [10000, 10001]
   },
   abilityDescription: {
      'Sung-jin-woo': 'Shadows heal allies for a fraction of Sung-jin-woo\'s max health',
      'Mikasa': 'Mikasa\'s next attack has a chance to paralyze the enemy',
      'Luffy': 'Increases Luffy\'s damage for the next 2 rounds (does not stack)',
      'Gojo': 'Gojo distorts space, evading all attacks - duration increases with active allies',
      'Natsu': 'Natsu transforms, increasing damage and having a small chance to paralyze enemies for the next 3 rounds',
   },
   bgColors: {
      'Kirito': '#0A20A0',
      'Doflamingo': '#cd7cc5',
      'Tanjiro': '#6CCC74',
      'Escanor': '#E29A48',
      'Anderson': '#d8e386',
      'Korosensei': '#E5E632',
      'Hisoka': '#0A0235',
      'Saitama': 'black',
      'Sung-jin-woo': '#7ca7cd',
      'Mikasa': '#cdc17c',
      'Luffy': '#ce3f3f',
      'Gojo': '#dce8a3',
      'Natsu': '#8acd7c',
      'Ichigo': '#cd967c',
      'Kakashi': '#dbdce8',
      'Anya': '#e5a5a5',
      'Mudkip': '#3fcec9',
      'Genos': '#ebad4f',
      'Makima': '#9bdfc3',
   },
   defaultValues: {
      loadout: ['Sung-jin-woo', 'Mikasa', 'Luffy'],
      inventory: ['Gojo', 'Natsu', 'Ichigo', 'Kakashi', 'Anya', 'Mudkip', 'Genos', 'Makima'],
      cardLevels: {
         'Sung-jin-woo': 1,
         'Mikasa': 1,
         'Luffy': 1,
         'Gojo': 1, 'Natsu': 1, 'Ichigo': 1, 'Kakashi': 1, 'Anya': 1, 'Mudkip': 1, 'Genos': 1, 'Makima': 1
      },
      stagesComplete: [],
   },
   health: {
      'Kirito': [2000, 3000, 4000],
      'Doflamingo': [2000, 3500, 4000],
      'Tanjiro': [2000, 4500, 5000],
      'Escanor': [2000, 4000, 7000],
      'Anderson': [2000, 4000, 6000, 9000],
      'Korosensei': [2000, 4000, 6000, 8000, 11000],
      'Hisoka': [2000, 4000, 6000, 8000, 10000],
      'Saitama': [1000, 2000, 3000, 4000, 5000, 8000],
      'Sung-jin-woo': [400, 500, 600, 700, 800, 900],
      'Mikasa': [600, 800, 1000, 1200, 1400, 1600],
      'Luffy': [450, 600, 750, 900, 1050, 1200],
      'Gojo': [450, 600, 750, 900, 1050, 1200],
      'Natsu': [500, 675, 850, 1025, 1200, 1375],
   },
   bossNames: ['Kirito', 'Doflamingo', 'Tanjiro', 'Escanor', 'Anderson', 'Korosensei', 'Hisoka', 'Saitama'],
   bossDescriptions: ['Black Swordsman', 'Joker', 'Demon Slayer', 'Sin of Pride', 'Father', 'Tentacled Menace', 'Bungee Gum', 'One Punch Man'],
   bossLevels: [1, 2, 2, 3, 4, 5, 5, 6],
 }

 export default characterInfo;