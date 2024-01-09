/* eslint-disable react-hooks/exhaustive-deps */
import { AiOutlineStar, AiTwotoneStar } from "react-icons/ai"
import { BiDollar } from 'react-icons/bi'
import { MdOutlineContentCopy } from "react-icons/md"
import { MdCheckCircle } from "react-icons/md"
import ComponentStyle from "./ProductPageComponent.module.scss"
import { useContext, useEffect, useState } from "react"
import baseURL from "../../baseURL"
import Rating from '@mui/material/Rating';
import { useParams } from "react-router-dom"
import { calcDiscountedPrice, isTokenExpired, refreshTokenHandler, showMessage } from "../../functions"
import AuthContext from "../Context/AuthContext"
import { EmailIcon, EmailShareButton, TelegramIcon, WhatsappIcon, WhatsappShareButton, RedditIcon, RedditShareButton, LinkedinIcon, LinkedinShareButton, TelegramShareButton } from "react-share"
import { FaPlus, FaTrashCan } from "react-icons/fa6"
import { FaMinus } from "react-icons/fa"
import { Spinner } from "react-bootstrap"

function ProductPageComponent() {

    const otherImages = [
        "https://img.etimg.com/thumb/width-1200,height-900,imgsize-78972,resizemode-75,msid-99739108/top-trending-products/furniture/sofas/best-premium-sofa-sets-to-experience-luxurious-comfort.jpg",
        "https://cdn.barwefurniture.com/wp-content/uploads/2023/10/Mauck2070quot20Velvet20Squ-1276.jpg",
        "https://img.etimg.com/thumb/width-1200,height-900,imgsize-78972,resizemode-75,msid-99739108/top-trending-products/furniture/sofas/best-premium-sofa-sets-to-experience-luxurious-comfort.jpg",
        "https://5.imimg.com/data5/SELLER/Default/2023/9/348287983/AW/LN/XO/115688690/l-shape-sofa-set-luxury-500x500.jpg",
    ]
    // const rate = 4  // this line is for test!

    const [productInfo, setProductInfo] = useState({})
    const [rate, setRate] = useState(0)
    const [imageLoaded, setImageLoaded] = useState(true)
    const [mainImageIndex, setMainImageIndex] = useState(0)
    const [userComment, setUserComment] = useState("")
    const [productComments, setProductComments] = useState([])
    const [commentFlag, setCommentFlag] = useState(false)
    const [myRate, setMyRate] = useState(0)
    const [isRated, setIsRated] = useState(false)
    const [isCopied, setIsCopied] = useState(false)
    const [productCountInCart, setProductCountInCart] = useState(0)
    const [buttonPending, setButtonPending] = useState(false)
    const { productId } = useParams()

    const authContext = useContext(AuthContext)

    const productAdder = () => {
        if (!authContext?.isLoggedIn) {
            showMessage({
                title: "😕 Sorry!!",
                text: "To purchase a product, you must first log in to your account",
                icon: "warning"
            })
        } else {
            const userToken = JSON.parse(localStorage.getItem("userToken"))
            if (isTokenExpired(userToken.accessToken)) {
                refreshTokenHandler()
                    .then(token => {
                        authContext.writeTokenInStorage(token)
                        productAdder()
                    })
            } else {
                fetch(`${baseURL}/carts/me/items/${productId}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${userToken.accessToken}`
                    }
                }).then(res => {
                    console.log(res)
                    if (res.ok) {
                        setProductCountInCart(1)
                    }
                })
            }
        }
    }

    const sendComment = () => {
        if (userComment.trim() === "" || !isRated) {
            setCommentFlag(false)
            showMessage({
                title: "Oops!!",
                text: "Please leave a comment!",
                icon: "error"
            })
        } else {
            const userToken = JSON.parse(localStorage.getItem("userToken"))
            if (isTokenExpired(userToken?.accessToken)) {
                refreshTokenHandler()
                    .then(token => {
                        authContext.writeTokenInStorage(token)
                        productAdder()
                    })
            } else {
                let req_body = { "review": userComment, "rating": myRate }
                fetch(`${baseURL}/reviews/${productInfo._id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${userToken.accessToken}`,
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify(req_body)
                }).then(res => {
                    if (res.ok) {
                        showMessage({
                            title: "Thanks!! 😍",
                            text: "Your feedback has been successfully send!",
                            icon: "success"
                        })
                        setCommentFlag(false)
                    }
                    return res.json()
                }).then(data => console.log(data))
            }
        }
    }

    const getComments = (productID) => {
        fetch(`${baseURL}/reviews/${productID}`, {
            method: "GET"
        }).then(res => {
            return res.json()
        }).then(data => {
            setProductComments(data)
        })
    }

    const getProductQuantityInCart = (id) => {
        const userToken = JSON.parse(localStorage.getItem("userToken"))
        if (userToken) {
            if (isTokenExpired(userToken?.accessToken)) {
                refreshTokenHandler()
                    .then(token => {
                        authContext.writeTokenInStorage(token)
                        getProductQuantityInCart(id)
                    })
            } else {
                fetch(`${baseURL}/carts/me/items/${id}/quantity`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${userToken?.accessToken}`
                    }
                }).then(res => {
                    return res.json()
                }).then(data => {
                    if (data.quantity) {
                        setProductCountInCart(data.quantity)
                    }
                })
            }
        }
    }

    const changeQuantity = (type) => {
        const userToken = JSON.parse(localStorage.getItem("userToken"))
        if (isTokenExpired(userToken.accessToken)) {
            refreshTokenHandler()
                .then(token => {
                    authContext.writeTokenInStorage(token)
                    changeQuantity(type)
                })
        } else {
            if (type === "increase") {
                setButtonPending(1)
            } else {
                setButtonPending(-1)
            }
            fetch(`${baseURL}/carts/me/items/${productInfo._id}/quantity?action=${type}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${userToken.accessToken}`
                }
            }).then(res => {
                if (res.ok) {
                    if (type === "increase") {
                        authContext.productsCountCalculator(1)
                        setProductCountInCart(pre => pre + 1)
                    } else {
                        authContext.productsCountCalculator(-1)
                        setProductCountInCart(pre => pre - 1)
                    }
                }
                setButtonPending(0)
            })
        }
    }

    const productRemoveHandler = (id) => {
        const userToken = JSON.parse(localStorage.getItem("userToken"))
        if (isTokenExpired(userToken.accessToken)) {
            refreshTokenHandler()
                .then(token => {
                    authContext.writeTokenInStorage(token)
                    productRemoveHandler(id)
                })
        } else {
            fetch(`${baseURL}/carts/me/items/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${userToken.accessToken}`
                }
            }).then(res => {
                if (res.ok) {
                    setProductCountInCart(0)
                }
            })
        }
    }

    useEffect(() => {
        fetch(`${baseURL}/products/${productId}`, {
            method: "GET",
            headers: { "Content-type": "application/json" }
        }).then(res => {
            return res.json()
        }).then(data => {
            setProductInfo(data)
            setRate(data.rate)
            getComments(data._id)
        })
    }, [])

    useEffect(() => {
        if (productInfo._id) {
            getProductQuantityInCart(productInfo._id)
        }
    }, [productInfo])

    useEffect(() => {
        if (commentFlag) {
            sendComment()
        }
    }, [commentFlag])

    useEffect(() => {
        if (isCopied) {
            setTimeout(() => {
                setIsCopied(false)
            }, 2000)
        }
    }, [isCopied])

    return (
        <>
            <section className={ComponentStyle.ProductDetailSection}>
                {productInfo && <>
                    <div className={ComponentStyle.productPart}>
                        <div className={ComponentStyle.imagesWrapper}>
                            <div className={ComponentStyle.mainImgContainer}>
                                {imageLoaded && productInfo.discount ? <span className={ComponentStyle.discountBadge}>{productInfo.discount * 100}%</span> : null}
                                {imageLoaded ?
                                    // <img src={`${baseURL}/public/${productInfo?.imageUrl}`} alt={productInfo?.title} crossOrigin='false' onError={setImageLoaded(false)} />
                                    <img src={otherImages[mainImageIndex]} alt={productInfo?.title} onError={() => setImageLoaded(false)} />
                                    :
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-photo-off" width="44" height="44" viewBox="0 0 24 24" strokeWidth="2" stroke="#06a99d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M15 8h.01" />
                                        <path d="M7 3h11a3 3 0 0 1 3 3v11m-.856 3.099a2.991 2.991 0 0 1 -2.144 .901h-12a3 3 0 0 1 -3 -3v-12c0 -.845 .349 -1.608 .91 -2.153" />
                                        <path d="M3 16l5 -5c.928 -.893 2.072 -.893 3 0l5 5" />
                                        <path d="M16.33 12.338c.574 -.054 1.155 .166 1.67 .662l3 3" />
                                        <path d="M3 3l18 18" />
                                    </svg>
                                }
                            </div>
                            {otherImages.length ? <div className={ComponentStyle.otherImages}>
                                {otherImages.map((item, i) => (
                                    <img src={otherImages[i]} key={i} onClick={() => setMainImageIndex(i)} alt="product" className={i == mainImageIndex ? ComponentStyle.active : undefined} />
                                ))}
                            </div> : null}
                        </div>
                        <div className={ComponentStyle.productDetailContainer}>
                            <h4 className={ComponentStyle.productCategory}>{productInfo?.category}</h4>
                            <h3 className={ComponentStyle.ProductTitle}>{productInfo?.title}</h3>
                            <div className={ComponentStyle.detailRow}>
                                {productInfo?.title && <span className={ComponentStyle.price}><BiDollar />{calcDiscountedPrice(productInfo)}</span>}
                                {rate && <div className={ComponentStyle.starsBox}>
                                    {
                                        Array.from(Array(productInfo.rate).keys())?.map((star, i) => (
                                            <AiTwotoneStar key={i} className={ComponentStyle.coloredStar} />
                                        ))
                                    }
                                    {
                                        Array.from(Array(5 - productInfo.rate).keys())?.map((star, i) => (
                                            <AiOutlineStar key={i} className={ComponentStyle.greyStar} />
                                        ))
                                    }
                                </div>}
                                <span className={ComponentStyle.review}>29 reviews {productCountInCart}</span>
                            </div>
                            <div className={ComponentStyle.share_box}>
                                <h5 className={ComponentStyle.title}>share this product</h5>
                                <div className={ComponentStyle.url_box}>
                                    {isCopied ? <MdCheckCircle className={ComponentStyle.checked} /> : <MdOutlineContentCopy className={ComponentStyle.copy_icon} onClick={() => { navigator.clipboard.writeText(document.URL); setIsCopied(true) }} />}
                                    <div className={`${ComponentStyle.url} ${isCopied ? ComponentStyle.success : undefined}`}>{isCopied ? "Copied" : document.URL}</div>
                                </div>
                                <div className={ComponentStyle.social_icons}>
                                    <TelegramShareButton url={document.URL}>
                                        <TelegramIcon size={32} round={true} />
                                    </TelegramShareButton>
                                    <EmailShareButton url={document.URL}>
                                        <EmailIcon size={32} round={true} />
                                    </EmailShareButton>
                                    <WhatsappShareButton url={document.URL}>
                                        <WhatsappIcon size={32} round={true} />
                                    </WhatsappShareButton>
                                    <LinkedinShareButton url={document.URL}>
                                        <LinkedinIcon size={32} round={true} />
                                    </LinkedinShareButton>
                                    <RedditShareButton url={document.URL}>
                                        <RedditIcon size={32} round={true} />
                                    </RedditShareButton>
                                </div>
                            </div>
                            <div className={ComponentStyle.description}>
                                Your choice of seating can make a difference. For any programmer, it’s essential to find something that is both comfortable and ergonomically supportive.
                            </div>
                            <div className={ComponentStyle.btnBox}>
                                {!productCountInCart ?
                                    <button className={ComponentStyle.addBtn} onClick={productAdder}>Add to Cart</button>
                                    :
                                    <div className={ComponentStyle.countBox}>
                                        <button
                                            className={ComponentStyle.count_btn}
                                            onClick={() => { productCountInCart === 1 ? productRemoveHandler(productInfo._id) : changeQuantity("decrease") }}
                                        >
                                            {
                                                (buttonPending === -1) ? <Spinner animation="grow" variant="light" /> :
                                                    (productCountInCart === 1 && buttonPending !== -1) ? <FaTrashCan />
                                                        :
                                                        ((productCountInCart > 1) && (buttonPending !== -1)) ? <FaMinus /> : null
                                            }
                                        </button>
                                        <input className={ComponentStyle.count_show} disabled value={productCountInCart} />
                                        <button
                                            className={`${ComponentStyle.count_btn} ${productCountInCart == 5 && ComponentStyle.disabled}`}
                                            disabled={productCountInCart == 5}
                                            onClick={() => changeQuantity("increase")}
                                        >
                                            {(buttonPending === 1) && <Spinner animation="grow" variant="light" />}
                                            {(buttonPending !== 1) && <FaPlus />}
                                        </button>
                                    </div>}
                            </div>
                        </div>
                    </div>
                </>
                }
                {authContext.isLoggedIn && <div className={ComponentStyle.your_comment}>
                    <h4>Please rate us and leave your comment!</h4>
                    <Rating
                        name="size-large"
                        value={myRate}
                        onChange={(event, newValue) => {
                            setMyRate(newValue)
                            setIsRated(true)
                        }}
                        readOnly={isRated}
                    />
                    <textarea className={ComponentStyle.showInput} value={userComment} onChange={e => setUserComment(e.target.value)}></textarea>
                    <button onClick={() => setCommentFlag(true)} className={ComponentStyle.showBtn}>Send</button>
                </div>}
                <div className={ComponentStyle.commentsWrapper}>
                    <h3 className={ComponentStyle.commentsHeader}>Product Comments</h3>
                    <div className={ComponentStyle.commentsContainer}>
                        {
                            productComments.map((comment, i) => (
                                <div key={i} className={ComponentStyle.commentItem}>
                                    <div className={ComponentStyle.row1}>
                                        <div className={ComponentStyle.authorBox}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-hipchat" width="36" height="36" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#06a99d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M17.802 17.292s.077 -.055 .2 -.149c1.843 -1.425 3 -3.49 3 -5.789c0 -4.286 -4.03 -7.764 -9 -7.764c-4.97 0 -9 3.478 -9 7.764c0 4.288 4.03 7.646 9 7.646c.424 0 1.12 -.028 2.088 -.084c1.262 .82 3.104 1.493 4.716 1.493c.499 0 .734 -.41 .414 -.828c-.486 -.596 -1.156 -1.551 -1.416 -2.29z" />
                                                <path d="M7.5 13.5c2.5 2.5 6.5 2.5 9 0" />
                                            </svg>
                                            <strong className={ComponentStyle.authorName}>Faraz</strong>
                                        </div>
                                        <span className={ComponentStyle.commentRate}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="#06a99d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                                            </svg>
                                            <b>4</b>
                                        </span>
                                    </div>
                                    <q className={ComponentStyle.bodyPart}>
                                        A couch, also known as a sofa, settee, chesterfield, or davenport, is a cushioned item of furniture for seating multiple people (although it is not uncommon for a single person to use a couch alone).
                                    </q>
                                    <div className={ComponentStyle.end}>
                                        <span className={ComponentStyle.time}>December 21</span>
                                    </div>
                                </div>
                            ))
                        }
                        <div className={ComponentStyle.commentItem}>
                            <div className={ComponentStyle.row1}>
                                <div className={ComponentStyle.authorBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-hipchat" width="36" height="36" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#06a99d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M17.802 17.292s.077 -.055 .2 -.149c1.843 -1.425 3 -3.49 3 -5.789c0 -4.286 -4.03 -7.764 -9 -7.764c-4.97 0 -9 3.478 -9 7.764c0 4.288 4.03 7.646 9 7.646c.424 0 1.12 -.028 2.088 -.084c1.262 .82 3.104 1.493 4.716 1.493c.499 0 .734 -.41 .414 -.828c-.486 -.596 -1.156 -1.551 -1.416 -2.29z" />
                                        <path d="M7.5 13.5c2.5 2.5 6.5 2.5 9 0" />
                                    </svg>
                                    <strong className={ComponentStyle.authorName}>Nasir</strong>
                                </div>
                                <span className={ComponentStyle.commentRate}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="#06a99d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                                    </svg>
                                    <b>5</b>
                                </span>
                            </div>
                            <q className={ComponentStyle.bodyPart}>
                                A couch, also known as a sofa, settee, chesterfield, or davenport, is a cushioned item of furniture for seating multiple people (although it is not uncommon for a single person to use a couch alone).
                            </q>
                            <div className={ComponentStyle.end}>
                                <span className={ComponentStyle.time}>February 8</span>
                            </div>
                        </div>
                        <div className={ComponentStyle.commentItem}>
                            <div className={ComponentStyle.row1}>
                                <div className={ComponentStyle.authorBox}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-brand-hipchat" width="36" height="36" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#06a99d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M17.802 17.292s.077 -.055 .2 -.149c1.843 -1.425 3 -3.49 3 -5.789c0 -4.286 -4.03 -7.764 -9 -7.764c-4.97 0 -9 3.478 -9 7.764c0 4.288 4.03 7.646 9 7.646c.424 0 1.12 -.028 2.088 -.084c1.262 .82 3.104 1.493 4.716 1.493c.499 0 .734 -.41 .414 -.828c-.486 -.596 -1.156 -1.551 -1.416 -2.29z" />
                                        <path d="M7.5 13.5c2.5 2.5 6.5 2.5 9 0" />
                                    </svg>
                                    <strong className={ComponentStyle.authorName}>Navid</strong>
                                </div>
                                <span className={ComponentStyle.commentRate}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-star" width="32" height="32" viewBox="0 0 24 24" strokeWidth="2" stroke="#06a99d" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M12 17.75l-6.172 3.245l1.179 -6.873l-5 -4.867l6.9 -1l3.086 -6.253l3.086 6.253l6.9 1l-5 4.867l1.179 6.873z" />
                                    </svg>
                                    <b>3</b>
                                </span>
                            </div>
                            <q className={ComponentStyle.bodyPart}>
                                A couch, also known as a sofa, settee, chesterfield, or davenport, is a cushioned item of furniture for seating multiple people (although it is not uncommon for a single person to use a couch alone).
                            </q>
                            <div className={ComponentStyle.end}>
                                <span className={ComponentStyle.time}>October 16</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default ProductPageComponent