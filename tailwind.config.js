/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./App.{js,jsx,ts,tsx}","./Apps/**/*.{js,jsx,ts,tsx}"],
  
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        customred: '#DC3535', 
        customButton: '#D17842', 
        customblack: '#0C0F14',
        customgrayL: '#252A32', 
        customgrayM: '#52555A', 
        customgrayS: '#AEAEAE', 
        
       
      },

    },
  },
  plugins: [],
}

