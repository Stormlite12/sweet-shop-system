import HeroSlider from '../components/HeroSlider'
import SweetCards from '../components/SweetCards'

export default function Home({ cart, onOpenCart }) {
  return (
    <div>
      <HeroSlider />
      <SweetCards cart={cart} onOpenCart={onOpenCart} />
    </div>
  )
}