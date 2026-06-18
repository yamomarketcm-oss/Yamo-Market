import { ShoppingBag } from 'lucide-react'
import React from 'react'

const Footer = () => {
  return (
    <div>
      {/* ── Footer ── */}
      <footer className="bg-green-900 text-green-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 grid-cols-2 py-8 px-8">
          <div className='mx-auto'>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
                <ShoppingBag size={16} className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">YamoMarket</span>
            </div>
            <p className="text-sm sm:w-80 w-40 text-green-300">Le marché digital officiel du Cameroun — local, fiable, rapide.</p>
          </div>
          <div className='mx-auto'>
            <p className="text-white font-semibold mb-3 text-sm">Liens rapides</p>
            <ul className="space-y-2 text-sm text-green-300">
              {['Produits', 'Boutiques', 'Catégories', 'Offres'].map(l => (
                <li key={l} className="hover:text-white cursor-pointer transition-colors">{l}</li>
              ))}
            </ul>
          </div>
          <div className='mx-auto'>
            <p className="text-white font-semibold mb-3 text-sm">Contact</p>
            <ul className="space-y-2 text-sm text-green-300">
              <li>yamomarket237@gmail.com</li>
              <li>+237 695760989</li>
              <li>Yaoundé, Cameroun</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 py-4 text-center text-xs font-medium text-green-500">
          © {new Date().getFullYear()} YamoMarket. Tous droits réservés.
        </div>
      </footer>
    </div>
  )
}

export default Footer
