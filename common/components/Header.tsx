import { RiAuctionFill, RiHomeFill, RiCarFill } from 'react-icons/ri'
import { GiHomeGarage } from 'react-icons/gi';
import Link from 'next/link'

const Header: React.FC = () => {
    return (
        <nav className="nav_bar row-hcenter">
            <div className="mr-2">
                <Link href="/">
                    <button className="btn btn-clear">
                        <RiHomeFill className="size-xxl color-light_1 weight-semibold"></RiHomeFill>
                    </button>
                </Link>
            </div>

            <div className="mr-2">
                <Link href="/auctions">
                    <button className="btn btn-clear">
                        <RiAuctionFill className="size-xxl color-light_1 weight-semibold"></RiAuctionFill>
                    </button>
                </Link>
            </div>

            <div className="mr-2">
                <Link href="/cars">
                    <button className="btn btn-clear">
                        <RiCarFill className="size-xxl color-light_1 weight-semibold"></RiCarFill>
                    </button>
                </Link>
            </div>

            <div className="mr-2">
                <Link href="/garage">
                    <button className="btn btn-clear">
                        <GiHomeGarage className="size-xxl color-light_1 weight-semibold"></GiHomeGarage>
                    </button>
                </Link>
            </div>
        </nav>
    )
}

export default Header;