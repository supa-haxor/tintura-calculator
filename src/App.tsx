import { useState } from 'react';
import productPrices from './data/prices.json';
import servicePriceData from './data/servicePrices.json';

type FieldType = 'text' | 'date' | 'number' | 'textarea' | 'select';

type Field = {
  label: string;
  name: string;
  type?: FieldType;
  placeholder?: string;
  options?: string[];
};

type ServiceValues = {
  nombre: string;
  apellido: string;
  fechaColor: string;
  trabajoRealizado: string;
  decolorante: string;
  fantasiaColor: string;
  volumenOxicrem: string;
  keratinaAlisado: string;
  papelAluminio: string;
  toallasDesechables: string;
  corte: string;
  cepillado: string;
  cobro: string;
};

type ValueField = Field & {
  value: string;
  unit?: string;
  onChange: (value: string) => void;
};

type Tintura = {
  nombre: string;
  gramos: string;
};

type ProductPrice = {
  id: string;
  nombre: string;
  cantidad: number;
  tipoMedida: string;
  precio: number;
};

type ServicePrice = {
  id: string;
  nombre: string;
  precio: number;
};

type ServicePrices = {
  cortes: ServicePrice[];
  cepillados: ServicePrice[];
};

type ReceiptRow = {
  label: string;
  value: string;
  variant?: 'success' | 'featured' | 'danger';
  badge?: string;
};

const products = productPrices as ProductPrice[];
const servicePrices = servicePriceData as ServicePrices;

const getProduct = (id: string) => {
  const product = products.find((currentProduct) => currentProduct.id === id);

  if (!product) {
    throw new Error(`Producto no encontrado: ${id}`);
  }

  return product;
};

const getUnitPrice = (id: string) => {
  const product = getProduct(id);

  return product.precio / product.cantidad;
};

const getServicePrice = (options: ServicePrice[], selectedName: string) =>
  options.find((option) => option.nombre === selectedName)?.precio ?? 0;

const clientFields: Field[] = [
  { label: 'Nombre', name: 'nombre', placeholder: 'Ej: Maria' },
  { label: 'Apellido', name: 'apellido', placeholder: 'Ej: Rodriguez' },
  { label: 'Fecha de color', name: 'fechaColor', type: 'date' },
  {
    label: 'Trabajo realizado',
    name: 'trabajoRealizado',
    type: 'textarea',
    placeholder: 'Describe el servicio de color',
  },
];

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es', {
    maximumFractionDigits: 2,
  }).format(value);

const formatMoney = (value: number) => `$${new Intl.NumberFormat('es').format(Math.round(value))}`;

const toNumber = (value: string) => Number(value) || 0;

const getTodayDateInputValue = () => {
  const today = new Date();
  const timezoneOffset = today.getTimezoneOffset() * 60_000;

  return new Date(today.getTime() - timezoneOffset).toISOString().slice(0, 10);
};

const scrollToContent = (elementId: string) => {
  window.setTimeout(() => {
    document.getElementById(elementId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 0);
};

const initialValues: ServiceValues = {
  nombre: '',
  apellido: '',
  fechaColor: getTodayDateInputValue(),
  trabajoRealizado: '',
  decolorante: '',
  fantasiaColor: '',
  volumenOxicrem: '',
  keratinaAlisado: '',
  papelAluminio: '',
  toallasDesechables: '',
  corte: '',
  cepillado: '',
  cobro: '',
};

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isPriceListOpen, setIsPriceListOpen] = useState(false);
  const [values, setValues] = useState<ServiceValues>(initialValues);
  const [tinturas, setTinturas] = useState<Tintura[]>([{ nombre: '', gramos: '' }]);

  const updateValue = (name: keyof ServiceValues, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const addTintura = () => {
    setTinturas((currentTinturas) => [...currentTinturas, { nombre: '', gramos: '' }]);
  };

  const updateTintura = (index: number, field: keyof Tintura, value: string) => {
    setTinturas((currentTinturas) =>
      currentTinturas.map((tintura, tinturaIndex) =>
        tinturaIndex === index ? { ...tintura, [field]: value } : tintura,
      ),
    );
  };

  const removeTintura = (index: number) => {
    setTinturas((currentTinturas) => currentTinturas.filter((_, tinturaIndex) => tinturaIndex !== index));
  };

  const openServiceForm = () => {
    setIsPriceListOpen(false);
    setIsFormOpen(true);
    scrollToContent('service-form');
  };

  const togglePriceList = () => {
    const shouldOpenPriceList = !isPriceListOpen;

    setIsFormOpen(false);
    setIsPriceListOpen(shouldOpenPriceList);

    if (shouldOpenPriceList) {
      scrollToContent('price-list');
    }
  };

  const decolorante = toNumber(values.decolorante);
  const fantasiaColor = toNumber(values.fantasiaColor);
  const keratinaAlisado = toNumber(values.keratinaAlisado);
  const totalTinturas = tinturas.reduce((total, tintura) => total + toNumber(tintura.gramos), 0);
  const plexProtecteur = decolorante * 0.066;
  const oxicremPorTintura = totalTinturas * 1.5;
  const oxicremPorDecolorante = decolorante;
  const precioCorte = getServicePrice(servicePrices.cortes, values.corte);
  const precioCepillado = getServicePrice(servicePrices.cepillados, values.cepillado);
  const totalQuimicosUsados =
    decolorante * getUnitPrice('decolorante') +
    totalTinturas * getUnitPrice('tintura') +
    (oxicremPorTintura + oxicremPorDecolorante) * getUnitPrice('oxicrem') +
    plexProtecteur * getUnitPrice('plexProtecteur') +
    fantasiaColor * getUnitPrice('fantasiaColor') +
    keratinaAlisado * getUnitPrice('proKeratineAlisado');
  const totalMateriales =
    toNumber(values.papelAluminio) * getUnitPrice('aluminio') +
    toNumber(values.toallasDesechables) * getUnitPrice('toallasDesechables');
  const totalProductos = totalQuimicosUsados + totalMateriales;
  const gananciasProductos = totalProductos * 0.3;
  const servicioAplicacionProducto = totalProductos;
  const totalServicio = precioCorte + precioCepillado + servicioAplicacionProducto;
  const gananciaServicio = gananciasProductos + totalServicio;
  const valorEstimadoServicio = totalServicio + gananciasProductos + totalProductos;
  const cobro = toNumber(values.cobro);
  const descuento = cobro > 0 ? Math.max(valorEstimadoServicio - cobro, 0) : 0;
  const descuentoPorcentaje = valorEstimadoServicio > 0 ? (descuento / valorEstimadoServicio) * 100 : 0;

  const decoloranteProduct = getProduct('decolorante');
  const tinturaProduct = getProduct('tintura');
  const oxicremProduct = getProduct('oxicrem');
  const fantasiaColorProduct = getProduct('fantasiaColor');
  const plexProtecteurProduct = getProduct('plexProtecteur');
  const keratinaProduct = getProduct('proKeratineAlisado');
  const aluminioProduct = getProduct('aluminio');
  const toallasProduct = getProduct('toallasDesechables');

  const controlledClientFields = clientFields.map((field) => ({
    ...field,
    value: values[field.name as keyof ServiceValues],
    onChange: (value: string) => updateValue(field.name as keyof ServiceValues, value),
  }));

  const materialFields: ValueField[] = [
    {
      label: 'Papel aluminio',
      name: 'papelAluminio',
      type: 'number',
      placeholder: 'Cantidad',
      unit: aluminioProduct.tipoMedida,
      value: values.papelAluminio,
      onChange: (value) => updateValue('papelAluminio', value),
    },
    {
      label: 'Toallas desechables',
      name: 'toallasDesechables',
      type: 'number',
      placeholder: 'Cantidad',
      unit: toallasProduct.tipoMedida,
      value: values.toallasDesechables,
      onChange: (value) => updateValue('toallasDesechables', value),
    },
    {
      label: 'Corte',
      name: 'corte',
      type: 'select',
      options: servicePrices.cortes.map((option) => option.nombre),
      value: values.corte,
      onChange: (value) => updateValue('corte', value),
    },
    {
      label: 'Cepillado',
      name: 'cepillado',
      type: 'select',
      options: servicePrices.cepillados.map((option) => option.nombre),
      value: values.cepillado,
      onChange: (value) => updateValue('cepillado', value),
    },
  ];

  const paymentFields: ValueField[] = [
    {
      label: 'Cobro',
      name: 'cobro',
      type: 'number',
      placeholder: '$0.00',
      value: values.cobro,
      onChange: (value) => updateValue('cobro', value),
    },
  ];
  const productReceiptRows: ReceiptRow[] = [
    { label: 'Precio quimicos usados', value: formatMoney(totalQuimicosUsados) },
    { label: 'Precio materiales usados', value: formatMoney(totalMateriales) },
    { label: 'Total productos', value: formatMoney(totalProductos), variant: 'featured' },
    { label: 'Ganancias de productos', value: formatMoney(gananciasProductos), variant: 'success' },
  ];
  const serviceReceiptRows: ReceiptRow[] = [
    { label: 'Precio corte', value: formatMoney(precioCorte) },
    { label: 'Precio cepillado', value: formatMoney(precioCepillado) },
    { label: 'Servicio de aplicacion de producto', value: formatMoney(servicioAplicacionProducto) },
    { label: 'Total de servicio', value: formatMoney(totalServicio), variant: 'featured' },
  ];
  const finalReceiptRows: ReceiptRow[] = [
    { label: 'Total productos', value: formatMoney(totalProductos) },
    { label: 'Total de servicio', value: formatMoney(totalServicio) },
    { label: 'Ganancia del servicio', value: formatMoney(gananciaServicio), variant: 'success' },
    { label: 'Valor estimado del servicio', value: formatMoney(valorEstimadoServicio), variant: 'featured' },
    { label: 'Cobro', value: formatMoney(cobro) },
    {
      label: 'Descuento',
      value: formatMoney(descuento),
      variant: 'danger',
      badge: `${formatNumber(descuentoPorcentaje)}%`,
    },
  ];

  return (
    <main className={`app-shell ${isFormOpen ? 'has-floating-receipt' : ''}`}>
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Calculadora de tintura</span>
          <h1>Servicios de color bonitos, ordenados y faciles de cobrar.</h1>
          <p>
            Una primera version para registrar productos, materiales, servicios y cobro en una sola ficha.
          </p>
        </div>

        <div className="hero-actions">
          <button className="primary-action" type="button" onClick={openServiceForm}>
            Nuevo servicio
          </button>
          <button className="secondary-action" type="button" onClick={togglePriceList}>
            {isPriceListOpen ? 'Ocultar precios' : 'Ver precios'}
          </button>
        </div>
      </section>

      {isPriceListOpen ? <PriceList products={products} servicePrices={servicePrices} /> : null}

      {isFormOpen ? (
        <>
        <form className="service-form" id="service-form">
          <div className="form-header">
            <div>
              <span className="eyebrow">Ficha de color</span>
              <h2>Nuevo servicio</h2>
            </div>
            <button className="ghost-button" type="button" onClick={() => setIsFormOpen(false)}>
              Cerrar
            </button>
          </div>

          <FieldGroup title="Cliente" fields={controlledClientFields} />

          <fieldset className="form-section">
            <legend>Productos y quimicos</legend>
            <div className="field-list">
              <div className="dynamic-card">
                <div className="dynamic-header">
                  <div>
                    <span>Tinturas</span>
                    <small>Agrega las tinturas que uses en el servicio.</small>
                  </div>
                  <button className="small-button" type="button" onClick={addTintura}>
                    + Agregar
                  </button>
                </div>

                <div className="tintura-list">
                  {tinturas.map((tintura, index) => (
                    <label className="tintura-row" key={`tintura-${index + 1}`}>
                      <span>Tintura {index + 1}</span>
                      <input
                        name={`tintura-${index + 1}-nombre`}
                        type="text"
                        value={tintura.nombre}
                        placeholder="Nombre o tono"
                        onChange={(event) => updateTintura(index, 'nombre', event.target.value)}
                      />
                      <input
                        name={`tintura-${index + 1}-gramos`}
                        type="number"
                        min="0"
                        value={tintura.gramos}
                        placeholder={tinturaProduct.tipoMedida}
                        onChange={(event) => updateTintura(index, 'gramos', event.target.value)}
                      />
                      <span className="unit-pill">{tinturaProduct.tipoMedida}</span>
                      {tinturas.length > 1 ? (
                        <button className="remove-button" type="button" onClick={() => removeTintura(index)}>
                          Quitar
                        </button>
                      ) : null}
                    </label>
                  ))}
                </div>
              </div>

              <InputCard
                field={{
                  label: 'Decolorante 1+1',
                  name: 'decolorante',
                  type: 'number',
                  placeholder: 'Cantidad',
                  unit: decoloranteProduct.tipoMedida,
                  value: values.decolorante,
                  onChange: (value) => updateValue('decolorante', value),
                }}
              />
              <InputCard
                field={{
                  label: 'Fantasia color',
                  name: 'fantasiaColor',
                  type: 'number',
                  placeholder: 'Cantidad',
                  unit: fantasiaColorProduct.tipoMedida,
                  value: values.fantasiaColor,
                  onChange: (value) => updateValue('fantasiaColor', value),
                }}
              />
              <AutoCard label="Plex protecteur" value={`${formatNumber(plexProtecteur)} ${plexProtecteurProduct.tipoMedida}`} />
              <InputCard
                field={{
                  label: 'Volumen de oxicrem',
                  name: 'volumenOxicrem',
                  placeholder: 'Ej: 20 vol',
                  value: values.volumenOxicrem,
                  onChange: (value) => updateValue('volumenOxicrem', value),
                }}
              />
              <AutoCard
                label="Cantidad de oxicrem por tintura"
                value={`${formatNumber(oxicremPorTintura)} ${oxicremProduct.tipoMedida}`}
              />
              <AutoCard
                label="Cantidad de oxicrem por decolorante"
                value={`${formatNumber(oxicremPorDecolorante)} ${oxicremProduct.tipoMedida}`}
              />
              <InputCard
                field={{
                  label: 'Keratina alisado permanente',
                  name: 'keratinaAlisado',
                  type: 'number',
                  placeholder: 'Cantidad',
                  unit: keratinaProduct.tipoMedida,
                  value: values.keratinaAlisado,
                  onChange: (value) => updateValue('keratinaAlisado', value),
                }}
              />
            </div>
          </fieldset>

          <FieldGroup title="Materiales y extras" fields={materialFields} />

          <fieldset className="form-section auto-section">
            <legend>Resultados automaticos</legend>
            <div className="receipt-grid">
              <ReceiptCard title="Recibo productos" rows={productReceiptRows} />
              <ReceiptCard title="Recibo servicios" rows={serviceReceiptRows} />
              <ReceiptCard title="Recibo final" rows={finalReceiptRows} featured />
            </div>
          </fieldset>

          <FieldGroup title="Cobro final" fields={paymentFields} />

        </form>
        <FloatingReceipt
          totalProductos={formatMoney(totalProductos)}
          totalServicio={formatMoney(totalServicio)}
          valorEstimadoServicio={formatMoney(valorEstimadoServicio)}
          gananciaServicio={formatMoney(gananciaServicio)}
        />
        </>
      ) : null}
    </main>
  );
}

function FieldGroup({ title, fields }: { title: string; fields: ValueField[] }) {
  return (
    <fieldset className="form-section">
      <legend>{title}</legend>
      <div className="field-list">
        {fields.map((field) => (
          <InputCard field={field} key={field.name} />
        ))}
      </div>
    </fieldset>
  );
}

function InputCard({ field }: { field: ValueField }) {
  const inputType = field.type ?? 'text';

  return (
    <label className={`input-card ${inputType === 'textarea' ? 'full-width' : ''}`}>
      <span>{field.label}</span>
      {inputType === 'textarea' ? (
        <textarea
          name={field.name}
          rows={4}
          value={field.value}
          placeholder={field.placeholder}
          onChange={(event) => field.onChange(event.target.value)}
        />
      ) : inputType === 'select' ? (
        <select name={field.name} value={field.value} onChange={(event) => field.onChange(event.target.value)}>
          <option value="" disabled>
            Seleccionar
          </option>
          {field.options?.map((option) => (
            <option value={option} key={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <div className={field.unit ? 'measurement-control' : undefined}>
          <input
            name={field.name}
            type={inputType}
            min={inputType === 'number' ? '0' : undefined}
            value={field.value}
            placeholder={field.placeholder}
            onChange={(event) => field.onChange(event.target.value)}
          />
          {field.unit ? <span className="unit-pill">{field.unit}</span> : null}
        </div>
      )}
    </label>
  );
}

function AutoCard({ label, value, variant }: { label: string; value: string; variant?: 'success' | 'featured' }) {
  return (
    <label className={`input-card auto-card ${variant ? `auto-card-${variant}` : ''}`}>
      <span>{label}</span>
      <input disabled value={value} />
    </label>
  );
}

function ReceiptCard({ title, rows, featured = false }: { title: string; rows: ReceiptRow[]; featured?: boolean }) {
  return (
    <section className={`breakdown-receipt ${featured ? 'breakdown-receipt-featured' : ''}`}>
      <h3>{title}</h3>
      <dl>
        {rows.map((row) => (
          <div className={`receipt-row ${row.variant ? `receipt-row-${row.variant}` : ''}`} key={row.label}>
            <dt>{row.label}</dt>
            <dd>
              {row.badge ? <span className="receipt-badge">{row.badge}</span> : null}
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function FloatingReceipt({
  totalProductos,
  totalServicio,
  valorEstimadoServicio,
  gananciaServicio,
}: {
  totalProductos: string;
  totalServicio: string;
  valorEstimadoServicio: string;
  gananciaServicio: string;
}) {
  return (
    <aside className="floating-receipt" aria-label="Resumen del servicio">
      <div>
        <span className="receipt-eyebrow">Recibo</span>
        <h3>Resumen</h3>
      </div>

      <dl className="receipt-list">
        <div>
          <dt>Total productos</dt>
          <dd>{totalProductos}</dd>
        </div>
        <div>
          <dt>Total de servicio</dt>
          <dd>{totalServicio}</dd>
        </div>
        <div className="receipt-featured">
          <dt>Valor estimado</dt>
          <dd>{valorEstimadoServicio}</dd>
        </div>
        <div className="receipt-success">
          <dt>Ganancia del servicio</dt>
          <dd>{gananciaServicio}</dd>
        </div>
      </dl>

      <button className="primary-action receipt-action" type="button">
        Enviar
      </button>
    </aside>
  );
}

function PriceList({ products, servicePrices }: { products: ProductPrice[]; servicePrices: ServicePrices }) {
  return (
    <section className="price-card" id="price-list">
      <div className="price-header">
        <div>
          <span className="eyebrow">Lista de precios</span>
          <h2>Productos</h2>
        </div>
      </div>

      <div className="price-table-wrapper">
        <table className="price-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Unidad de medida</th>
              <th>Precio</th>
              <th>Precio por unidad</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.nombre}</td>
                <td>
                  {formatNumber(product.cantidad)} {product.tipoMedida}
                </td>
                <td>{formatMoney(product.precio)}</td>
                <td>{formatMoney(product.precio / product.cantidad)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="price-header price-header-spaced">
        <div>
          <span className="eyebrow">Servicios</span>
          <h2>Cortes y cepillados</h2>
        </div>
      </div>

      <div className="price-table-wrapper">
        <table className="price-table service-price-table">
          <thead>
            <tr>
              <th>Servicio</th>
              <th>Opcion</th>
              <th>Precio</th>
            </tr>
          </thead>
          <tbody>
            {servicePrices.cortes.map((service) => (
              <tr key={`corte-${service.id}`}>
                <td>Corte</td>
                <td>{service.nombre}</td>
                <td>{formatMoney(service.precio)}</td>
              </tr>
            ))}
            {servicePrices.cepillados.map((service) => (
              <tr key={`cepillado-${service.id}`}>
                <td>Cepillado</td>
                <td>{service.nombre}</td>
                <td>{formatMoney(service.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default App;
