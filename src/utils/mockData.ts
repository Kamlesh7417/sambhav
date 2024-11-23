import { faker } from '@faker-js/faker/locale/en';
import { format, subDays, addDays } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const generateMockOrders = (count: number) => {
  const orders: Record<string, any> = {};
  const now = new Date();

  const orderTypes = [
    'Electronics - High Value',
    'Textiles - Bulk',
    'Automotive Parts',
    'Medical Supplies',
    'Food & Beverages',
    'Chemicals',
    'Machinery',
    'Consumer Goods'
  ];

  const priorities = ['Standard', 'Express', 'Urgent'];
  const statuses = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

  for (let i = 1; i <= count; i++) {
    const orderId = `ORD${String(i).padStart(3, '0')}`;
    const itemQuantity = faker.number.int({ min: 1, max: 100 });
    const itemPrice = faker.number.int({ min: 1000, max: 100000 });
    
    orders[orderId] = {
      id: orderId,
      customer: faker.company.name(),
      date: format(subDays(now, faker.number.int({ min: 0, max: 30 })), 'yyyy-MM-dd'),
      status: faker.helpers.arrayElement(statuses),
      total: itemQuantity * itemPrice,
      items: [
        {
          name: faker.commerce.productName(),
          quantity: itemQuantity,
          price: itemPrice,
          specifications: {
            weight: `${faker.number.float({ min: 0.1, max: 100, precision: 0.1 })}kg`,
            dimensions: `${faker.number.int({ min: 10, max: 100 })}x${faker.number.int({ min: 10, max: 100 })}x${faker.number.int({ min: 10, max: 100 })}cm`,
            category: faker.commerce.department()
          }
        }
      ],
      origin: `${faker.location.city()}, ${faker.location.state()}, India`,
      destination: `${faker.location.city()}, ${faker.location.country()}`,
      type: faker.helpers.arrayElement(orderTypes),
      priority: faker.helpers.arrayElement(priorities),
      specialRequirements: Array.from(
        { length: faker.number.int({ min: 1, max: 3 }) },
        () => faker.helpers.arrayElement([
          'Temperature controlled storage',
          'Special handling required',
          'Insurance mandatory',
          'Express clearance needed',
          'Fragile items',
          'Hazardous materials'
        ])
      ),
      customsInfo: {
        hsCode: faker.number.int({ min: 1000, max: 9999 }) + '.' + faker.number.int({ min: 10, max: 99 }) + '.' + faker.number.int({ min: 10, max: 99 }),
        declaredValue: itemQuantity * itemPrice,
        exportLicense: `EL${format(now, 'yyyy')}/${faker.number.int({ min: 100000, max: 999999 })}`
      }
    };
  }

  return orders;
};

export const generateMockShipments = (count: number) => {
  const shipments: Record<string, any> = {};
  const now = new Date();

  const carriers = ['Maersk', 'DHL', 'MSC', 'CMA CGM', 'Hapag-Lloyd'];
  const shipmentTypes = ['Sea Freight', 'Air Freight', 'Road Transport', 'Rail Freight'];
  const statuses = ['Processing', 'In Transit', 'Delivered', 'Cancelled'];

  for (let i = 1; i <= count; i++) {
    const shipmentId = `SHP${String(i).padStart(3, '0')}`;
    const orderId = `ORD${String(faker.number.int({ min: 1, max: 25 })).padStart(3, '0')}`;
    const status = faker.helpers.arrayElement(statuses);
    const progress = status === 'Delivered' ? 100 : faker.number.int({ min: 0, max: 90 });
    
    const origin = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
    };
    
    const destination = {
      lat: faker.location.latitude(),
      lng: faker.location.longitude()
    };

    const events = Array.from({ length: faker.number.int({ min: 3, max: 8 }) }, () => ({
      id: uuidv4(),
      timestamp: format(subDays(now, faker.number.int({ min: 0, max: 30 })), "yyyy-MM-dd'T'HH:mm:ss"),
      location: faker.location.city(),
      status: faker.helpers.arrayElement([
        'Picked up',
        'In Transit',
        'Customs Clearance',
        'Out for Delivery',
        'Delivered'
      ]),
      description: faker.helpers.arrayElement([
        'Package has been picked up',
        'Package is in transit',
        'Package is undergoing customs clearance',
        'Package is out for delivery',
        'Package has been delivered'
      ]),
      type: faker.helpers.arrayElement(['pickup', 'transit', 'customs', 'delivery', 'exception']),
      coordinates: {
        lat: faker.location.latitude(),
        lng: faker.location.longitude()
      }
    }));

    shipments[shipmentId] = {
      id: shipmentId,
      orderId,
      origin: faker.location.city() + ', ' + faker.location.country(),
      destination: faker.location.city() + ', ' + faker.location.country(),
      status,
      carrier: faker.helpers.arrayElement(carriers),
      type: faker.helpers.arrayElement(shipmentTypes),
      eta: format(addDays(now, faker.number.int({ min: 1, max: 30 })), 'yyyy-MM-dd'),
      lastUpdate: faker.helpers.arrayElement([
        'Package cleared customs',
        'In transit to destination',
        'Arrived at local facility',
        'Out for delivery'
      ]),
      progress,
      tracking: events,
      coordinates: {
        origin,
        destination,
        current: progress < 100 ? {
          lat: faker.location.latitude(),
          lng: faker.location.longitude()
        } : destination
      }
    };
  }

  return shipments;
};

export const generateMockDocuments = (count: number) => {
  const documents: Record<string, any> = {};
  const now = new Date();

  const documentTypes = [
    'Commercial Invoice',
    'Bill of Lading',
    'Certificate of Origin',
    'Packing List',
    'Insurance Certificate',
    'Export License',
    'Import License',
    'Phytosanitary Certificate',
    'Letter of Credit',
    'Customs Declaration'
  ];

  const statuses = ['Draft', 'Final', 'Approved', 'Rejected'];

  for (let i = 1; i <= count; i++) {
    const documentId = `DOC${String(i).padStart(3, '0')}`;
    const orderId = `ORD${String(faker.number.int({ min: 1, max: 25 })).padStart(3, '0')}`;
    const type = faker.helpers.arrayElement(documentTypes);
    
    documents[documentId] = {
      id: documentId,
      orderId,
      name: type,
      type: type.split(' ')[0],
      date: format(subDays(now, faker.number.int({ min: 0, max: 30 })), 'yyyy-MM-dd'),
      size: `${faker.number.int({ min: 100, max: 5000 })} KB`,
      url: `/documents/${documentId}.pdf`,
      status: faker.helpers.arrayElement(statuses),
      metadata: {
        createdBy: faker.person.fullName(),
        lastModified: format(subDays(now, faker.number.int({ min: 0, max: 5 })), "yyyy-MM-dd'T'HH:mm:ss"),
        version: faker.system.semver(),
        tags: Array.from(
          { length: faker.number.int({ min: 1, max: 3 }) },
          () => faker.helpers.arrayElement(['Important', 'Urgent', 'Review Required', 'Confidential'])
        )
      }
    };
  }

  return documents;
};

export const generateRealisticCommunications = (count: number) => {
  const communications = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    communications.push({
      id: uuidv4(),
      sender: faker.person.fullName(),
      role: faker.helpers.arrayElement(['carrier', 'buyer', 'seller', 'agent']),
      message: faker.helpers.arrayElement([
        'I have reviewed the shipping documentation and everything appears to be in order.',
        'The customs clearance process has been initiated. We expect it to be completed within 24-48 hours.',
        'There might be a slight delay due to port congestion. We are working on alternative routes.',
        'Your shipment has been cleared by customs and is now en route to the destination.',
        'We have successfully negotiated better rates for your shipment.',
        'Additional documentation is required for customs clearance. Please provide the following...',
        'Weather conditions are causing some delays in the region. We will keep you updated.',
        'The estimated delivery date has been updated based on current transit times.',
        'Your cargo has been loaded onto the vessel and is scheduled to depart today.',
        'Insurance coverage has been confirmed for your shipment.'
      ]),
      timestamp: format(subDays(now, i), "yyyy-MM-dd'T'HH:mm:ss")
    });
  }

  return communications;
};