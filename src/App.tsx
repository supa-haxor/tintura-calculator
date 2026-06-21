import { useState } from 'react';

type FieldType = 'text' | 'date' | 'number' | 'textarea' | 'select';

type Field = {
  label: string;
  name: string;
  type?: FieldType;
  placeholder?: string;
  options?: string[];
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

const chemicalFields: Field[] = [
  { label: 'Decolorante 1+1', name: 'decolorante', type: 'number', placeholder: 'Cantidad' },
  { label: 'Fantasia color', name: 'fantasiaColor', type: 'number', placeholder: 'Cantidad' },
  { label: 'Plex protecteur', name: 'plexProtecteur', type: 'number', placeholder: 'Cantidad' },
  {
    label: 'Volumen de oxicrem',
    name: 'volumenOxicrem',
    type: 'select',
    options: ['10 vol', '20 vol', '30 vol', '40 vol'],
  },
  {
    label: 'Cantidad de oxicrem por tintura',
    name: 'oxicremTintura',
    type: 'number',
    placeholder: 'Cantidad',
  },
  {
    label: 'Cantidad de oxicrem por decolorante',
    name: 'oxicremDecolorante',
    type: 'number',
    placeholder: 'Cantidad',
  },
  {
    label: 'Keraina alisado permanente',
    name: 'kerainaAlisado',
    type: 'number',
    placeholder: 'Cantidad',
  },
];

const materialFields: Field[] = [
  { label: 'Papel aluminio', name: 'papelAluminio', type: 'number', placeholder: 'Cantidad' },
  { label: 'Toallas desechables', name: 'toallasDesechables', type: 'number', placeholder: 'Cantidad' },
  {
    label: 'Corte',
    name: 'corte',
    type: 'select',
    options: ['No', 'Si'],
  },
  {
    label: 'Cepillado',
    name: 'cepillado',
    type: 'select',
    options: ['No', 'Si'],
  },
];

const resultFields = [
  'Total de quimicos usados',
  'Total materiales',
  'Total productos',
  'Ganancias por productos',
  'Precio corte',
  'Precio cepillado',
  'Ganancias por servicio',
  'Total ganancias',
  'Valor estimado del servicio',
];

const paymentFields: Field[] = [
  { label: 'Cobro', name: 'cobro', type: 'number', placeholder: '$0.00' },
  { label: 'Descuento', name: 'descuento', type: 'number', placeholder: '$0.00' },
];

function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [tinturas, setTinturas] = useState(['']);

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

          <FieldGroup title="Cliente" fields={clientFields} />

          <fieldset className="form-section">
            <legend>Productos y quimicos</legend>
            <div className="field-list">
              <label className="input-card">
                <span>Tinturas utilizadas</span>
                <input name="tinturasUtilizadas" type="number" min="0" placeholder="Cantidad total" />
              </label>

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
                        type="text"
                        value={tintura}
                        placeholder="Marca, tono o cantidad"
                        onChange={(event) => updateTintura(index, event.target.value)}
                      />
                      {tinturas.length > 1 ? (
                        <button className="remove-button" type="button" onClick={() => removeTintura(index)}>
                          Quitar
                        </button>
                      ) : null}
                    </label>
                  ))}
                </div>
              </div>

              {chemicalFields.map((field) => (
                <InputCard field={field} key={field.name} />
              ))}
            </div>
          </fieldset>

          <FieldGroup title="Materiales y extras" fields={materialFields} />

          <fieldset className="form-section auto-section">
            <legend>Resultados automaticos</legend>
            <div className="field-list">
              {resultFields.map((label) => (
                <label className="input-card auto-card" key={label}>
                  <span>{label}</span>
                  <input disabled placeholder="Se calcula despues" />
                </label>
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

function FieldGroup({ title, fields }: { title: string; fields: Field[] }) {
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

function InputCard({ field }: { field: Field }) {
  const inputType = field.type ?? 'text';

  return (
    <label className={`input-card ${inputType === 'textarea' ? 'full-width' : ''}`}>
      <span>{field.label}</span>
      {inputType === 'textarea' ? (
        <textarea name={field.name} rows={4} placeholder={field.placeholder} />
      ) : inputType === 'select' ? (
        <select name={field.name} defaultValue="">
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
        <input name={field.name} type={inputType} min={inputType === 'number' ? '0' : undefined} placeholder={field.placeholder} />
      )}
    </label>
  );
}

export default App;
