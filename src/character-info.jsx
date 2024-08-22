 const characterInfo = {
   abilities: {
      'Sung-jin-woo': ['Mutilation', 'Shadow Regeneration'],
      'Mikasa': ['Thunder Spears', 'Charge'],
      'Luffy': ['Gum-Gum: Pistol', 'Gear 3'],
   },
   abilityDamages: {
      'Sung-jin-woo': [160, 200],
      'Mikasa': [80, 120],
      'Luffy': [110, 130],
   },
   enemyAbilityDamages: {
      'Kirito': [200, 250],
   },
   abilityDescription: {
      'Sung-jin-woo': 'Shadows heal allies for a fraction of Sung-jin-woo\'s remaining health',
      'Mikasa': 'Mikasa\'s next attack has a chance to paralyze the enemy',
      'Luffy': 'Increases Luffy\'s damage for the next 2 rounds (does not stack)',
   },
   bgColors: {
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
      'Sung-jin-woo': [400, 500, 600],
      'Mikasa': [600, 800, 900],
      'Luffy': [450, 600, 750],
      'Kirito': [500, 1000, 2000],
   },
   bossNames: ['Kirito'],
   bossLevels: [3],
 }

 export default characterInfo;