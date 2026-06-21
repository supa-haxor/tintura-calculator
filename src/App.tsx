import { useState } from 'react';
import prices from './data/prices.json';

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

const moneyFormatter = new Intl.NumberFormat('es', {
  style: 'currency',
  currency: 'USD',
});

const formatNumber = (value: number) =>
  new Intl.NumberFormat('es', {
    maximumFractionDigits: 2,
  }).format(value);

const toNumber = (value: string) => Number(value) || 0;

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [values, setValues] = useState<ServiceValues>(initialValues);
  const [tinturas, setTinturas] = useState(['']);

  const updateValue = (name: keyof ServiceValues, value: string) => {
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  };

  const addTintura = () => {
    setTinturas((currentTinturas) => [...currentTinturas, '']);
  };

  const updateTintura = (index: number, value: string) => {
    setTinturas((currentTinturas) =>
      currentTinturas.map((tintura, tinturaIndex) => (tinturaIndex === index ? value : tintura)),
    );
  };

  const removeTintura = (index: number) => {
    setTinturas((currentTinturas) => currentTinturas.filter((_, tinturaIndex) => tinturaIndex !== index));
  };

  const decolorante = toNumber(values.decolorante);
  const fantasiaColor = toNumber(values.fantasiaColor);
  const keratinaAlisado = toNumber(values.keratinaAlisado);
  const totalTinturas = tinturas.reduce((total, tintura) => total + toNumber(tintura), 0);
  const plexProtecteur = decolorante * 0.066;
  const oxicremPorTintura = totalTinturas * 1.5;
  const oxicremPorDecolorante = decolorante;
  const totalQuimicosUsados =
    decolorante * prices.decolorante +
    totalTinturas * prices.tintura +
    (oxicremPorTintura + oxicremPorDecolorante) * prices.oxicrem +
    fantasiaColor * prices.fantasiaColor +
    keratinaAlisado * prices.keratina * 2;

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
      unit: 'hojas',
      value: values.papelAluminio,
      onChange: (value) => updateValue('papelAluminio', value),
    },
    {
      label: 'Toallas desechables',
      name: 'toallasDesechables',
      type: 'number',
      placeholder: 'Cantidad',
      unit: 'hojas',
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

        <button className="primary-action" type="button" onClick={() => setIsFormOpen(true)}>
          Nuevo servicio
        </button>
      </section>

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
                        name={`tintura-${index + 1}`}
                        type="number"
                        min="0"
                        value={tintura}
                        placeholder="Cantidad"
                        onChange={(event) => updateTintura(index, event.target.value)}
                      />
                      <span className="unit-pill">g</span>
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
                  unit: 'g',
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
                  unit: 'g',
                  value: values.fantasiaColor,
                  onChange: (value) => updateValue('fantasiaColor', value),
                }}
              />
              <AutoCard label="Plex protecteur" value={`${formatNumber(plexProtecteur)} g`} />
              <InputCard
                field={{
                  label: 'Volumen de oxicrem',
                  name: 'volumenOxicrem',
                  placeholder: 'Ej: 20 vol',
                  value: values.volumenOxicrem,
                  onChange: (value) => updateValue('volumenOxicrem', value),
                }}
              />
              <AutoCard label="Cantidad de oxicrem por tintura" value={`${formatNumber(oxicremPorTintura)} g`} />
              <AutoCard label="Cantidad de oxicrem por decolorante" value={`${formatNumber(oxicremPorDecolorante)} g`} />
              <InputCard
                field={{
                  label: 'Keratina alisado permanente',
                  name: 'keratinaAlisado',
                  type: 'number',
                  placeholder: 'Cantidad',
                  unit: 'ml',
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
              <AutoCard label="Total de quimicos usados" value={moneyFormatter.format(totalQuimicosUsados)} />
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

export default App;
