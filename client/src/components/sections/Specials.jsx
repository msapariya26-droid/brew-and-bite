import React, { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Chip from '../ui/Chip';
import { usePreorder } from '../../context/PreorderContext';
import { Timer } from 'lucide-react';
import { formatPrice } from '../../lib/format';
import { fetchMenu } from '../../lib/api';

export default function Specials() {
  const { addItem } = usePreorder();
  const [specials, setSpecials] = useState([]);
  const [addedId, setAddedId] = useState(null);

  const handleAdd = (item) => {
    addItem(item);
    setAddedId(item.id);
    setTimeout(() => {
      document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
    }, 600);
    setTimeout(() => {
      setAddedId(null);
    }, 2000);
  };

  useEffect(() => {
    fetchMenu()
      .then(items => {
        setSpecials(items.filter(i => i.special));
      })
      .catch(e => console.error(e));
  }, []);

  return (
    <section id="specials" className="flex flex-col px-margin-mobile py-space-lg gap-space-md xl:max-w-7xl xl:mx-auto w-full">
      <div className="flex items-end justify-between">
        <div className="flex flex-col">
          <span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">Chef Selections</span>
          <h2 className="font-headline-sm text-headline-sm text-on-surface">Weekly House Specialties</h2>
        </div>
        <span className="font-label-sm text-label-sm px-2.5 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed">Limited Daily</span>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-space-md">
        {specials.map(item => (
          <Card key={item.id} className="flex flex-col">
            <div className="relative w-full h-44 bg-surface-container overflow-hidden">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.target.src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300' fill='%23eae8e4'%3E%3Crect width='400' height='300'/%3E%3C/svg%3E"; }} />
              <div className="absolute top-3 left-3">
                 <Chip variant="primary">Special Edition</Chip>
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-surface/90 backdrop-blur-md text-secondary font-title-md shadow">
                {formatPrice(item.price)}
              </div>
            </div>
            <div className="p-space-md flex flex-col gap-space-xs flex-1">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">{item.name}</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed flex-1">
                {item.description}
              </p>
              <div className="pt-2 flex items-center justify-between">
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1">
                  <Timer size={15} /> Prepared fresh
                </span>
                <Button 
                  variant={addedId === item.id ? 'primary' : 'secondary'} 
                  className={`px-space-md py-1.5 h-auto text-label-md font-label-md transition-all duration-300 ${addedId === item.id ? 'animate-pulse' : 'hover:-translate-y-1 active:scale-95 group-hover:bg-secondary group-hover:text-on-secondary'}`} 
                  onClick={() => handleAdd(item)}
                >
                  {addedId === item.id ? 'Added' : 'Pre-Order'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
