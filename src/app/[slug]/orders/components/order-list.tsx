"use client"

import { OrderStatus, Prisma } from "@prisma/client";
import clsx from "clsx";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/helpers/format-currency";

interface OrderListProps {
  orders: Prisma.OrderGetPayload<{
    include: {
      restaurant: {
        select: {
          name: true;
          avatarImageUrl: true;
        };
      };
      orderProducts: {
        include: {
          product: true;
        };
      };
    };
  }>[];
}


const getStatusLabel = (status: OrderStatus) => {
  if (status === "FINISHED") return "Finalizado";
  if (status === "IN_PREPARATION") return "Em preparo";
  if (status === "PENDING") return "Pendente";
  return "";
};

const OrderList = ({ orders }: OrderListProps) => {
  const router = useRouter();
  
  return (
    <div className="space-y-6 p-6">
      <Button size="icon" variant="secondary" className="rounded-full" onClick={() => router.back()}>
        <ChevronLeftIcon />
      </Button>
      <div className="flex items-center gap-3">
        <ScrollTextIcon />
        <h2 className="text-lg font-semibold">Meus Pedidos</h2>
      </div>
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="space-y-4 p-5">
            <div
              className={clsx(
                "w-fit rounded-full px-2 py-1 text-xs font-semibold text-white",
                {
                  "bg-green-400": order.status === OrderStatus.FINISHED,
                  "bg-yellow-400": order.status === OrderStatus.IN_PREPARATION,
                  "bg-gray-400 text-gray-100": order.status === OrderStatus.PENDING,
                }
              )}
            >
              {getStatusLabel(order.status)}
            </div>
            <div className="flex items-center gap-2">
              <div className="relative h-5 w-5">
                <Image
                  src={order.restaurant.avatarImageUrl}
                  alt={order.restaurant.name}
                  className="rounded-sm"
                  fill
                  priority
                />
              </div>
              <p className="text-sm font-semibold">{order.restaurant.name}</p>
            </div>
            <Separator />
            <div className="space-y-2">
              {order.orderProducts.map((orderProducts) => (
                <div key={orderProducts.id} className="flex items-center gap-2">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-400 text-xs font-semibold text-white">
                    {orderProducts.quantity}
                  </div>
                  <p className="text-sm">{orderProducts.product.name}</p>
                </div>
              ))}
            </div>
            <Separator />
            <p className="text-sm font-medium">{formatCurrency(order.total)}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrderList;