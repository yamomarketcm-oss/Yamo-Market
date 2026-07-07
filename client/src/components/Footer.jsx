import { ShoppingBag } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../img/logo_yamo_market_circle.png';

const Footer = () => {
  return (
    <div>
      {/* ── Footer ── */}
      <footer className="bg-green-900 text-green-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 grid-cols-2 py-8 px-8">
          <div className='mx-auto'>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-green-500 flex items-center justify-center">
                <img src={logo} className="w-6 h-6" alt="YamoMarket Logo" />
              </div>
              <span className="text-white font-bold text-lg">YamoMarket</span>
            </div>
            <p className="sm:text-sm text-xs sm:w-80 w-40 text-green-300">Le marché digital officiel du Cameroun — local, fiable, rapide.</p>
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
              <li>yamomarketcm@gmail.com</li>
              <li>+237 695760989</li>
              <li>Douala, Cameroun</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-green-800 py-4 text-center text-xs font-medium text-green-500">
          © {new Date().getFullYear()} YamoMarket. <Link to="/terms" className="hover:underline">Tous droits réservés.</Link>
        </div>
      </footer>
    </div>
  )
}

export default Footer
