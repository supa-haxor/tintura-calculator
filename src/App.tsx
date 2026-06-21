import { useState } from 'react';
import productPrices from './data/prices.json';

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
  tinturasUtilizadas: string;
  decolorante: string;
  fantasiaColor: string;
  volumenOxicrem: string;
  keratinaAlisado: string;
  papelAluminio: string;
  toallasDesechables: string;
  corte: string;
  cepillado: string;
  cobro: string;
  descuento: string;
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

const products = productPrices as ProductPrice[];

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

const initialValues: ServiceValues = {
  nombre: '',
  apellido: '',
  fechaColor: '',
  trabajoRealizado: '',
  tinturasUtilizadas: '',
  decolorante: '',
  fantasiaColor: '',
  volumenOxicrem: '',
  keratinaAlisado: '',
  papelAluminio: '',
  toallasDesechables: '',
  corte: '',
  cepillado: '',
  cobro: '',
  descuento: '',
};

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es', {
    maximumFractionDigits: 2,
  }).format(value);

const formatMoney = (value: number) => `$${new Intl.NumberFormat('es').format(Math.round(value))}`;

const toNumber = (value: string) => Number(value) || 0;

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

  const decolorante = toNumber(values.decolorante);
  const fantasiaColor = toNumber(values.fantasiaColor);
  const keratinaAlisado = toNumber(values.keratinaAlisado);
  const totalTinturas = tinturas.reduce((total, tintura) => total + toNumber(tintura.gramos), 0);
  const plexProtecteur = decolorante * 0.066;
  const oxicremPorTintura = totalTinturas * 1.5;
  const oxicremPorDecolorante = decolorante;
  const totalQuimicosUsados =
    decolorante * getUnitPrice('decolorante') +
    totalTinturas * getUnitPrice('tintura') +
    (oxicremPorTintura + oxicremPorDecolorante) * getUnitPrice('oxicrem') +
    fantasiaColor * getUnitPrice('fantasiaColor') +
    keratinaAlisado * getUnitPrice('proKeratineAlisado') * 2;

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
      options: ['No', 'Si'],
      value: values.corte,
      onChange: (value) => updateValue('corte', value),
    },
    {
      label: 'Cepillado',
      name: 'cepillado',
      type: 'select',
      options: ['Corto', 'Medio', 'Largo'],
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
    {
      label: 'Descuento',
      name: 'descuento',
      type: 'number',
      placeholder: '$0.00',
      value: values.descuento,
      onChange: (value) => updateValue('descuento', value),
    },
  ];

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div className="hero-copy">
          <span className="eyebrow">Calculadora de tintura</span>
          <h1>Servicios de color bonitos, ordenados y faciles de cobrar.</h1>
          <p>
            Una primera version para registrar productos, materiales, servicios y cobro en una sola ficha.
          </p>
        </div>

        <div className="hero-actions">
          <button className="primary-action" type="button" onClick={() => setIsFormOpen(true)}>
            Nuevo servicio
          </button>
          <button className="secondary-action" type="button" onClick={() => setIsPriceListOpen((isOpen) => !isOpen)}>
            {isPriceListOpen ? 'Ocultar precios' : 'Ver precios'}
          </button>
        </div>
      </section>

      {isPriceListOpen ? <PriceList products={products} /> : null}

      {isFormOpen ? (
        <form className="service-form">
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
              <InputCard
                field={{
                  label: 'Tinturas utilizadas',
                  name: 'tinturasUtilizadas',
                  placeholder: 'Ej: Majirel 7.1 + 8.13',
                  value: values.tinturasUtilizadas,
                  onChange: (value) => updateValue('tinturasUtilizadas', value),
                }}
              />

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
            <div className="field-list">
              <AutoCard label="Total de quimicos usados" value={formatMoney(totalQuimicosUsados)} />
              {[
                'Total materiales',
                'Total productos',
                'Ganancias por productos',
                'Precio corte',
                'Precio cepillado',
                'Ganancias por servicio',
                'Total ganancias',
                'Valor estimado del servicio',
              ].map((label) => (
                <AutoCard label={label} value="Se calcula despues" key={label} />
              ))}
            </div>
          </fieldset>

          <FieldGroup title="Cobro final" fields={paymentFields} />

          <div className="form-actions">
            <button className="primary-action wide" type="button">
              Guardar borrador
            </button>
          </div>
        </form>
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

function AutoCard({ label, value }: { label: string; value: string }) {
  return (
    <label className="input-card auto-card">
      <span>{label}</span>
      <input disabled value={value} />
    </label>
  );
}

function PriceList({ products }: { products: ProductPrice[] }) {
  return (
    <section className="price-card">
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
    </section>
  );
}

export default App;
