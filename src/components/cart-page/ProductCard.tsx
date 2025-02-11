'use client';

import CartCounter from '@/components/ui/CartCounter';
import {
  addToCart,
  CartItem,
  remove,
  removeCartItem,
} from '@/lib/features/carts/cartsSlice';
import { useAppDispatch } from '@/lib/hooks/redux';
import { getImageLink, separateAttribute } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { PiTrashFill } from 'react-icons/pi';
import { Button } from '../ui/button';

type ProductCardProps = {
  data: CartItem;
};

const ProductCard = ({ data }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const attribute = data.attributes;

  const sizeAttributes = separateAttribute(attribute, 'Size');
  const colorAttributes = separateAttribute(attribute, 'Color');

  return (
    <div className='flex items-start space-x-4'>
      <Link
        href={`/shop/product/${data.slug}`}
        className='bg-[#F0EEED] rounded-lg w-full min-w-[100px] max-w-[100px] sm:max-w-[124px] aspect-square overflow-hidden'
      >
        <Image
          src={getImageLink(data.srcUrl)}
          width={124}
          height={124}
          className='rounded-md w-full h-full object-cover hover:scale-110 transition-all duration-500'
          alt={data.name}
          priority
        />
      </Link>
      <div className='flex w-full self-stretch flex-col'>
        <div className='flex items-center justify-between'>
          <Link
            href={`/shop/product/${data.slug}`}
            className='text-black font-bold text-base xl:text-xl'
          >
            {data.name}
          </Link>
          <Button
            variant='ghost'
            size='icon'
            className='h-5 w-5 md:h-9 md:w-9'
            onClick={() =>
              dispatch(
                remove({
                  id: data.id,
                  attributes: data.attributes,
                  quantity: data.quantity,
                })
              )
            }
          >
            <PiTrashFill className='text-xl md:text-2xl text-red-600' />
          </Button>
        </div>
        <div className='-mt-1'>
          <span className='text-black text-xs md:text-sm mr-1'>Size:</span>
          <span className='text-black/60 text-xs md:text-sm'>
            {sizeAttributes?.map((item) => item.av_value).join(', ')}
          </span>
        </div>
        {colorAttributes?.length ? (
          <div className='mb-auto -mt-1.5'>
            <span className='text-black text-xs md:text-sm mr-1'>Color:</span>
            <span className='text-black/60 text-xs md:text-sm'>
              {colorAttributes?.map((item) => item.av_value).join(', ')}
            </span>
          </div>
        ) : undefined}
        <div className='flex items-center flex-wrap justify-between'>
          <div className='flex items-center space-x-[5px] xl:space-x-2.5'>
            <span className='font-bold text-black text-xl xl:text-2xl'>
              {`৳${data.sale_price.toLocaleString()}`}
            </span>

            {data.discount.percentage > 0 ? (
              <span className='font-bold text-black/40 line-through text-xl xl:text-2xl'>
                ৳{Number(data.price).toLocaleString()}
              </span>
            ) : undefined}

            {data.discount.percentage > 0 ? (
              <span className='font-medium text-[10px] xl:text-xs py-1.5 px-3.5 rounded-full bg-[#FF3333]/10 text-[#FF3333]'>
                {`-${data.discount.percentage}%`}
              </span>
            ) : undefined}
          </div>
          <CartCounter
            initialValue={data.quantity}
            onAdd={() => dispatch(addToCart({ ...data, quantity: 1 }))}
            onRemove={() =>
              data.quantity === 1
                ? dispatch(
                    remove({
                      id: data.id,
                      attributes: data.attributes,
                      quantity: data.quantity,
                    })
                  )
                : dispatch(
                    removeCartItem({ id: data.id, attributes: data.attributes })
                  )
            }
            isZeroDelete
            className='px-5 py-3 max-h-8 md:max-h-10 min-w-[105px] max-w-[105px] sm:max-w-32'
          />
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
