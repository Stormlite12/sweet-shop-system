import HeroSlider from '../components/HeroSlider'
import SweetCards from '../components/SweetCards'

export default function Home({ cart, onOpenCart, onOpenAuth }) {
  return (
    <div>
      <HeroSlider />
      <SweetCards 
        cart={cart} 
        onOpenCart={onOpenCart} 
        onOpenAuth={onOpenAuth} 
      />
    </div>
  )
}