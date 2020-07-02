interface IItem {
  title: string;
  image: string;
}

interface ISerializedItem {
  name: string;
  image_url: string;
}

interface IPoint {
  id?: number;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  uf: string;
  items: number[];
  image: string;
}
