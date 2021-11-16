# Sistemas Operativos - Proyecto 2

## Integrantes

| Nombre                         | Carne               |
| ------------------------------ | ------------------- |
| Aldo Rigoberto Hernandez Avila | **201800585** |
| Cinthya Andrea Palomo Galvez   | **201700670** |
| Jose Fernando Guerra Muñoz    | **201731087** |

# Manual Tecnico

### Preguntas

> - Cómo funcionan las métricas de oro, cómo puedes interpretar las 7 pruebas de faulty traffic, usando como base los gráficos y métricas que muestra el tablero de Linkerd Grafana.
>>>
![image](https://user-images.githubusercontent.com/36779113/141875126-5d8e1c7e-598d-4290-8388-13956abb0da2.png)
 
>>>
> - Menciona al menos 3 patrones de comportamiento que hayas descubierto en las pruebas de faulty traffic
>>>
>- - 
>>>
> - ¿Qué sistema de mensajería es más rápido? ¿Por qué?
>>>
>- - Kafka, porque es capaz de procesar mensajes y almacenarlos con un modelo publicador-suscriptor con una alta escalabilidad y rendimiento, también  establece un período de retención en comparación con Google Pub-Sub. Kafka es mucho más usado en proyectos en los que se desea una alta tolerancia a fallos y procesamiento en tiempo real.
>>>
> - ¿Cuántos recursos utiliza cada sistema de mensajería?
>>>
>- - RabbitMQ
> ![image](https://user-images.githubusercontent.com/36779113/141876845-7056912c-b890-4682-b495-5ba12b321abd.png)
>- - Kafka
> ![image](https://user-images.githubusercontent.com/36779113/141876907-27eef487-fea3-4361-bde2-9efcbaa26054.png)

>- - PubSub Google
> ![image](https://user-images.githubusercontent.com/36779113/141876934-1774993a-37a0-492c-a45b-ca6633b0ebc2.png)

>>>
> - ¿Cuáles son las ventajas y desventajas de cada servicio de mensajería?

>>>
>- - RabbitMQ
>- Ventajas:
Adecuado para muchos protocolos de mensajería, flexibilidad y plugins disponibles, herramientas de desarrollo varias.
>- Desventajas:
No es transaccional por defecto, basado en Erlang para desarrollos.
>- - Kafka
>- Ventajas:
Buena escalabilidad, tolerancia a fallos, plataforma de streaming, multi-tenant, tiempo real, integrable con productos de terceros [Tibco, Mule e incluso Java]
>- Desventajas:
Dependencia con Apache Zookeeper, sin enrutamiento de mensajes, carece de componentes de monitorización nativos.
>- - PubSub Google
>- Ventajas:
Cloud Pub / Sub está completamente administrado por el desarrollador. No tiene que preocuparse por las máquinas, configurar clústeres, ajustar parámetros, etc., lo que significa que una gran cantidad de trabajo de DevOps se maneja por el propio desarrollador y esto es importante, especialmente cuando necesita escalar.
>- Desventajas:
Con Google Pub / Sub, una vez que se lee un mensaje de una suscripción y se ACK, desaparece. Para tener más copias de un mensaje para ser leídas por diferentes lectores, "distribuye" el tema creando "suscripciones" para ese tema, donde cada suscripción tendrá una copia completa de todo lo que entra en el tema. Pero esto también aumenta el costo porque Google cobra el uso de Pub / Sub por la cantidad de datos leídos.

>>>

> - ¿Cuál es el mejor sistema de mensajería?
>>>
>- - Según la imagen anteriores, Kafka resulta siendo el mejor sistema de mensajería debido a que no genera tanta latencia al momento de la interacción con la mensajería. Kafka guarda los mensajes, y cuando un consumidor se conecto le envia todo el historial
>>>
> - ¿Cuál de las dos bases de datos se desempeña mejor y por qué?
>>>
>- - MongoDB porque tiene más persistencia de datos en comparción con Redis.
>>>
> - ¿Cómo se reflejan en los dashboards de Linkerd los experimentos de Chaos Mesh?
>>>
>- - 
>>>
> - ¿En qué se diferencia cada uno de los experimentos realizados?
>>>
>- - Las primeras 3 rutas es solo un canal, mientras que las otras 3 rutas, la mitad se envía y la otra se redirecciona a faulty, mientras que en la última se distribuye en las 3 por lo que esa última es más eficiente porque se distribuye de 3 en 3.
>>>
> - ¿Cuál de todos los experimentos es el más dañino?
>>>
>- - El de faulty porque se matan los datos.
>>>

## Modelo de Base de Datos

> - MongoDB: es una base de datos NoSQL documental que almacena la información utilizando el formato de datos JSON. Un ejemplo de log se
> - Redis: es una base de datos NoSQL de clave-valor que implementa distintos tipos de estructuras de datos como listas, conjuntos, conjuntos ordenados, etc.

```JSON

{
  "request_number": number
  "game": number
  "gamename": string
  "winner": string
  "players": number
  "worker": string
} 
```

### Preguntas Base de Datos

> - ¿Cuál de las dos bases se desempeña mejor y por qué?
>
> - - debido a que están diseñados para diferentes propósitos, las capacidades mejoradas de Redis aumentan significativamente las capacidades de MongoDB, ya que MongoDB es una base de datos basada en disco y orientada a documentos optimizada para la simplicidad operativa, mientras que Redis es un almacén de estructura de datos persistente en memoria que permite realizar operaciones comunes con una complejidad mínima y un rendimiento máximo.

# Manual de Usuario

## Puntos Extras

![image](https://user-images.githubusercontent.com/36779113/141734871-47997ebe-bd4a-41b4-99e3-21d40fc5a6d4.png)
